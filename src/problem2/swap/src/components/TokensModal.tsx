import classNames from "classnames";
import { LuLoaderCircle } from "react-icons/lu";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { createPortal } from "react-dom";
import { useTokens } from "@/hooks/useTokens";
import type { Token } from "@/models/models";
import { getTokenLogoUrl } from "@/utils/utils";

const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn" as const,
    },
  },
};

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const TokensModal = ({
  title,
  onClick,
  onClose,
  exclude,
  isOpen,
}: {
  title: string;
  onClick: (item: Token) => void;
  onClose: () => void;
  exclude?: Token;
  isOpen: boolean;
}) => {
  const tokens = useTokens();

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[11] flex items-center justify-center p-4 bg-black/50"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
              <button
                id="closeModal"
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                onClick={onClose}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mb-6 min-w-56 max-h-96 overflow-y-auto p-3 app-scroll">
              <ul>
                {tokens.isLoading ? (
                  <li className="flex justify-center">
                    <LuLoaderCircle className="text-violet-500 animate-spin w-8 h-8" />
                  </li>
                ) : (
                  tokens.data?.map((token) => (
                    <li
                      key={token.currency}
                      className={classNames(
                        "p-3 border-b border-gray-200 hover:bg-gray-100 transition-colors duration-300",
                        {
                          hidden: exclude?.currency === token.currency,
                        }
                      )}
                    >
                      <a
                        className="flex items-center justify-between gap-5"
                        href="#"
                        onClick={() => onClick(token)}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={getTokenLogoUrl(token.currency)}
                            className="h-6 w-6 rounded-full"
                            alt={`${token.currency} icon`}
                            onError={(e) => (e.currentTarget.src = "/token.png")}
                          />
                          <span className="text-gray-800 font-medium">{token.currency}</span>
                        </div>
                        <span className="text-gray-600">${token.price}</span>
                      </a>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="flex justify-end">
              <button
                id="cancelModal"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};