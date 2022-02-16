import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface Props {
  open?: boolean;
  onClose: () => void;
}

const Info: React.FC<Props> = ({ open, onClose }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white dark:bg-black rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="text-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                  >
                    Author
                  </Dialog.Title>
                  <div className="mt-3 flex flex-col space-y-3">
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        shell.how
                      </span>{" "}
                      was made by{" "}
                      <a
                        href="https://twitter.com/phuctm97"
                        className="text-blue-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Minh-Phuc Tran
                      </a>{" "}
                      while working at{" "}
                      <a
                        href="https://fig.io"
                        className="text-blue-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Fig
                      </a>
                      . It uses open-source autocomplete specs in{" "}
                      <a
                        className=" text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                        href="https://github.com/withfig/autocomplete"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        withfig/autocomplete Github repo
                      </a>
                      .
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Want to contribute/create your own completions?{" "}
                      <a
                        className=" text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                        href="https://fig.io/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Check out fig.io/docs
                      </a>{" "}
                      to get started in {"<"}2 minutes.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-5">
                <a
                  className="inline-flex justify-center w-full space-x-1 rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-base text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:text-sm"
                  href="https://twitter.com/intent/tweet?text=I%20just%20used%20shell.how%20by%20%40fig%20to%20explain%20how%20my%20shell%20command%20works.%20Try%20it%20out%20%F0%9F%9A%80%F0%9F%9B%A0%F0%9F%91%89&url=https%3A%2F%2Fshell.how"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Tweet about</span>
                  <span className="font-semibold">shell.how</span>
                  <span>👉</span>
                </a>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Info;
