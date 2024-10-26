import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getContactInformation, updateContacts } from './_requests';

const ContactInformation = () => {
  const [initialContacts, setInitialContacts] = useState<Contacts>({
    phoneNumber: '',
    whatsappNumber: '',
    emailAddress: '',
    instagramLink: '',
  });
  const [currentContacts, setCurrentContacts] = useState<Contacts>({
    phoneNumber: '',
    whatsappNumber: '',
    emailAddress: '',
    instagramLink: '',
  });
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [changedBackend, setChangedBackend] = useState(false);

  const fetchContactsAsInitials = async () => {
    const restContacts = await getContactInformation();
    setInitialContacts(restContacts[0]);
  };

  const fetchContacts = async () => {
    const restContacts = await getContactInformation();
    setCurrentContacts(restContacts[0]);
    setLoadingContacts(false);
  };

  const revertChanges = async () => {
    setCurrentContacts(initialContacts);

    if (changedBackend) {
      await toast.promise(updateContacts(initialContacts), {
        loading: 'Değişiklikler geri alınıyor...',
        success: () => 'Değişiklikler geri alındı',
        error: () => 'Değişiklikler geri alınırken bir hata oluştu',
      });

      setChangedBackend(false);
    }
  };

  const handleUpdateContacts = async (e: React.FormEvent) => {
    e.preventDefault();

    if (JSON.stringify(currentContacts) != JSON.stringify(initialContacts)) {
      await toast.promise(updateContacts(currentContacts), {
        loading: 'Bilgiler güncelleniyor...',
        success: (msg) => msg,
        error: (err) => err.message,
      });

      setChangedBackend(true);
      fetchContacts();
    }
  };

  useEffect(() => {
    fetchContactsAsInitials();
    fetchContacts();
  }, []);

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="İletişim Bilgileri" />

        {loadingContacts ? (
          <div className="flex justify-center p-10 border border-stroke dark:border-strokedark bg-white shadow-default dark:bg-boxdark h-fit">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="p-7">
              <form action="POST" onSubmit={handleUpdateContacts}>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="phoneNumber"
                    >
                      Telefon Numarası <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill="currentColor"
                            d="M3.714 5.258C3.523 4 4.41 2.87 5.765 2.456a.99.99 0 0 1 1.214.598l.435 1.16a1 1 0 0 1-.26 1.088L5.86 6.487a.5.5 0 0 0-.152.47l.012.052l.031.13a7.3 7.3 0 0 0 .729 1.805a7.3 7.3 0 0 0 1.296 1.627l.04.036a.5.5 0 0 0 .482.103l1.673-.527a1 1 0 0 1 1.072.319l.792.961c.33.4.29.988-.089 1.341c-1.037.967-2.463 1.165-3.455.368a12.7 12.7 0 0 1-3.024-3.529a12.4 12.4 0 0 1-1.554-4.385m3.043 1.765l1.072-.984a2 2 0 0 0 .521-2.176l-.434-1.16A1.99 1.99 0 0 0 5.473 1.5c-1.683.515-3.034 2.024-2.748 3.909c.2 1.316.661 2.99 1.678 4.738a13.7 13.7 0 0 0 3.262 3.805c1.488 1.195 3.474.787 4.764-.415a1.98 1.98 0 0 0 .179-2.708l-.792-.962a2 2 0 0 0-2.144-.636l-1.389.437a6.6 6.6 0 0 1-.936-1.223a6.3 6.3 0 0 1-.59-1.421"
                          />
                        </svg>
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="phone"
                        name="phoneNumber"
                        id="phoneNumber"
                        placeholder="Telefon Numarası"
                        value={currentContacts.phoneNumber}
                        onChange={(e) =>
                          setCurrentContacts((prevContacts) => ({
                            ...(prevContacts || currentContacts),
                            phoneNumber: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="whatsappNumber"
                    >
                      WhatsApp Hattı <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"
                          />
                        </svg>
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="whatsappNumber"
                        id="whatsappNumber"
                        placeholder="WhatsApp Hattı"
                        value={currentContacts.whatsappNumber}
                        onChange={(e) =>
                          setCurrentContacts((prevContacts) => ({
                            ...(prevContacts || currentContacts),
                            whatsappNumber: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5 5 flex flex-col gap-5 5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      E-posta Adresi <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                              fill=""
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="email"
                        name="emailAddress"
                        id="emailAddress"
                        placeholder="E-posta Adresi"
                        value={currentContacts.emailAddress}
                        onChange={(e) =>
                          setCurrentContacts((prevContacts) => ({
                            ...(prevContacts || currentContacts),
                            emailAddress: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="instagramLink"
                    >
                      Instagram Linki <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 256 256"
                        >
                          <path
                            fill="currentColor"
                            d="M128 80a48 48 0 1 0 48 48a48.05 48.05 0 0 0-48-48m0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32m48-136H80a56.06 56.06 0 0 0-56 56v96a56.06 56.06 0 0 0 56 56h96a56.06 56.06 0 0 0 56-56V80a56.06 56.06 0 0 0-56-56m40 152a40 40 0 0 1-40 40H80a40 40 0 0 1-40-40V80a40 40 0 0 1 40-40h96a40 40 0 0 1 40 40ZM192 76a12 12 0 1 1-12-12a12 12 0 0 1 12 12"
                          />
                        </svg>
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="instagramLink"
                        id="instagramLink"
                        placeholder="Instagram Linki"
                        value={currentContacts.instagramLink}
                        onChange={(e) =>
                          setCurrentContacts((prevContacts) => ({
                            ...(prevContacts || currentContacts),
                            instagramLink: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4.5">
                  {JSON.stringify(currentContacts) !==
                    JSON.stringify(initialContacts) &&
                    changedBackend && (
                      <button
                        className="flex justify-center rounded bg-gray-700 py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                        type="button"
                        onClick={revertChanges}
                      >
                        Geri Al
                      </button>
                    )}
                  <button
                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 disabled:bg-gray-700"
                    type="submit"
                    disabled={
                      JSON.stringify(currentContacts) ===
                      JSON.stringify(initialContacts)
                    }
                  >
                    Güncelle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContactInformation;
