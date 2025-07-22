interface WalletBalance {
    currency: string;
    amount: number;
}
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}

interface Props extends BoxProps {

}
// getPriority can be placed outside the component if it doesn't need to access props or state, avoid redefining it on every render
// Avoid using 'any' type, use specific types instead
const getPriority = (blockchain: string): number => {
    switch (blockchain) {
        case 'Osmosis':
            return 100
        case 'Ethereum':
            return 50
        case 'Arbitrum':
            return 30
        case 'Zilliqa':
            return 20
        case 'Neo':
            return 20
        default:
            return -99
    }
}
const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    // const getPriority = (blockchain: any): number => {
    //     switch (blockchain) {
    //         case 'Osmosis':
    //             return 100
    //         case 'Ethereum':
    //             return 50
    //         case 'Arbitrum':
    //             return 30
    //         case 'Zilliqa':
    //             return 20
    //         case 'Neo':
    //             return 20
    //         default:
    //             return -99
    //     }
    // }

    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            // blockchain is not property of balance, but currency is
            const balancePriority = getPriority(balance.currency);
            // const balancePriority = getPriority(balance.blockchain);

            // lhsPriority is not defined, assuming it should be balancePriority
            const lhsPriority = balancePriority;
            // These 2 conditions can be simplified
            return ((lhsPriority > -99) && (balance.amount <= 0));
            // if (lhsPriority > -99) {
            //     if (balance.amount <= 0) {
            //         return true;
            //     }
            // }
            // return false
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            // blockchain is not property of balance, but currency is
            const leftPriority = getPriority(lhs.currency);
            const rightPriority = getPriority(rhs.currency);
            // const leftPriority = getPriority(lhs.blockchain);
            // const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
                return -1;
            } else if (rightPriority > leftPriority) {
                return 1;
            }
            // Missing return statement for equal priorities, assuming 0
            return 0;
        });
    }, [balances, prices]);

    // This should be memozized to avoid recalculating formatted balances on every render
    // toFixed() without arguments just converts number to string with no decimal places
    const formattedBalances = useMemo(() => {
        return sortedBalances.map((balance: WalletBalance) => {
            return {
                ...balance,
                formatted: balance.amount.toFixed(2) // Assuming we want to format the amount with 2 decimal places
            }
        })
    }, [sortedBalances]);

    // const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    //     return {
    //         ...balance,
    //         formatted: balance.amount.toFixed()
    //     }
    // })


    // Asumption: rows use formattedBalances instead of sortedBalances
    // Using index as key is not recommended, it can cause issues with React's reconciliation process, especially if the list can change
    const rows = () => formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
            <WalletRow
                className={classes.row}
                key={balance.currency}
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        )
    });
    
    // const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    //     const usdValue = prices[balance.currency] * balance.amount;
    //     return (
    //         <WalletRow
    //             className={classes.row}
    //             key={index}
    //             amount={balance.amount}
    //             usdValue={usdValue}
    //             formattedAmount={balance.formatted}
    //         />
    //     )
    // })

    return (
        <div {...rest}>
            {rows}
        </div>
    )
}