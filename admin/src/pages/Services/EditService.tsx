import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { editServiceById } from './_requests';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type Props = {
  serviceForEdit: Service;
  setServiceForEdit: Dispatch<SetStateAction<Service | undefined>>;
  fetchServices: () => Promise<void>;
};

export const EditService: React.FC<Props> = ({
  serviceForEdit,
  setServiceForEdit,
  fetchServices,
}) => {
  const [title, setTitle] = useState(serviceForEdit.title);
  const [description, setDescription] = useState(serviceForEdit.description);
  const [existingImages, setExistingImages] = useState<string[]>(
    serviceForEdit.images || [],
  );
  const [advantages, setAdvantages] = useState<string[]>(
    serviceForEdit.advantages || ['', ''],
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const [htmlContent, setHtmlContent] = useState(serviceForEdit.htmlContent);

  const clearEditServiceForm = () => {
    setTitle('');
    setDescription('');
    setExistingImages([]);
    setNewImages([]);
    setServiceForEdit(undefined);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setNewImages([...newImages, ...files]);
  };

  const handleEditServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await toast.promise(
      editServiceById({
        id: serviceForEdit.id,
        images: [...existingImages, ...newImages],
        title,
        description,
        advantages,
        htmlContent,
      }),
      {
        loading: 'Slayt ekleniyor...',
        success: (msg) => msg,
        error: (err) => err.message,
      },
    );

    fetchServices();
    clearEditServiceForm();
  };

  useEffect(() => {
    console.log(serviceForEdit.advantages);
  }, [serviceForEdit]);

  return (
    <>
      <div
        onClick={() => setServiceForEdit(undefined)}
        className="bg-overlay cursor-pointer absolute inset-0 bg-black-2 bg-opacity-80 block h-full w-full z-[999]"
      ></div>
      <div className="flex flex-col gap-9 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[1000] w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <div className="flex justify-between">
              <h3 className="font-medium text-black dark:text-white">
                <b>{serviceForEdit.title}</b> başlıklı slaytı düzenle
              </h3>
              <span
                className="cursor-pointer text-black-2 dark:text-white text-lg"
                onClick={() => setServiceForEdit(undefined)}
              >
                &times;
              </span>
            </div>
          </div>
          <form
            onSubmit={handleEditServiceSubmit}
            className="flex flex-col h-full max-h-full overflow-y-auto"
          >
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6">
                <div className="w-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Başlık <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ör. Betopan"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Açıklama <span className="text-meta-1">*</span>
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Ör. Betopan bir yapının temelinden çatısına kadar tüm iç ve dış mekanlarında kullanılabilen, fonksiyonel özelliklere sahip, çimentolu yonga levhadır."
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Birinci Avantaj <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ör. Yangına dayanıklı ve suya karşı dirençli."
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={advantages[0]}
                  onChange={(e) => {
                    const newAdvantages = [...advantages];
                    newAdvantages[0] = e.target.value;
                    setAdvantages(newAdvantages);
                  }}
                  required
                />
              </div>

              <div className="mb-4.5 flex flex-col gap6">
                <label className="mb-2.5 block text-black dark:text-white">
                  İkinci Avantaj <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ör. Uzun ömürlü ve çevre dostu malzeme."
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={advantages[1]}
                  onChange={(e) => {
                    const newAdvantages = [...advantages];
                    newAdvantages[1] = e.target.value;
                    setAdvantages(newAdvantages);
                  }}
                  required
                />
              </div>

              <div className="mb-4.5 flex flex-col gap-6">
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    İçerik <span className="text-meta-1">*</span>
                  </label>

                  <ReactQuill
                    value={htmlContent}
                    onChange={setHtmlContent}
                    theme="snow"
                  />
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Görsel <span className="text-meta-1">*</span>
                </label>

                <div
                  id="FileUpload"
                  className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray p-4 dark:bg-meta-4 sm:py-7.5"
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    onChange={handleFileChange}
                    required={existingImages.length + newImages.length < 1}
                  />

                  <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                          fill="#3C50E0"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                          fill="#3C50E0"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                          fill="#3C50E0"
                        />
                      </svg>
                    </span>
                    <p>
                      <span className="text-primary">
                        Yüklemek için tıklayın
                      </span>{' '}
                      veya görseli buraya sürükleyin.
                    </p>
                  </div>
                </div>

                {existingImages.length + newImages.length > 0 ? (
                  <div className="flex flex-wrap gap-3 relative z-99">
                    {(existingImages as (string | File)[])
                      .concat(newImages)
                      .map((img, idx) => (
                        <div className="relative" key={idx}>
                          <button
                            type="button"
                            className="flex justify-center items-center absolute h-full w-full bg-white bg-opacity-0 hover:bg-opacity-50 transition-all group"
                            onClick={() => {
                              if (typeof img === 'string') {
                                setExistingImages(
                                  existingImages.filter((i) => i !== img),
                                );
                              } else {
                                setNewImages(
                                  newImages.filter((file) => file !== img),
                                );
                              }
                            }}
                          >
                            <span className="flex justify-center items-center h-5 w-5 bg-danger rounded-full text-white opacity-0 group-hover:opacity-100 transition-all">
                              &times;
                            </span>
                          </button>

                          <img
                            className="h-24 w-24 object-cover rounded"
                            src={
                              typeof img === 'string'
                                ? `https://kocaelibetopan.com/uploads/${img}`
                                : URL.createObjectURL(img)
                            }
                            alt={typeof img === 'string' ? img : img.name}
                          />
                        </div>
                      ))}
                  </div>
                ) : (
                  ''
                )}
              </div>

              <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                Güncelle
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
