import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { editSliderById } from './_requests';

type Props = {
  sliderForEdit: Slider;
  setSliderForEdit: Dispatch<SetStateAction<Slider | undefined>>;
  fetchSliders: () => Promise<void>;
};

export const EditSliderModal: React.FC<Props> = ({
  sliderForEdit,
  setSliderForEdit,
  fetchSliders,
}) => {
  const [title, setTitle] = useState(sliderForEdit.title);
  const [description, setDescription] = useState(sliderForEdit.description);
  const [image, setImage] = useState<File | null>();
  const [link, setLink] = useState(sliderForEdit.link);

  const clearEditSliderForm = () => {
    setTitle('');
    setDescription('');
    setImage(null);
    setLink('');
    setSliderForEdit(undefined);
  };

  const handleEditSlider = async (e: React.FormEvent) => {
    e.preventDefault();

    await toast.promise(
      editSliderById({ id: sliderForEdit.id, image, title, description, link }),
      {
        loading: 'Slayt ekleniyor...',
        success: (msg) => msg,
        error: (err) => err.message,
      },
    );

    fetchSliders();
    clearEditSliderForm();
  };

  return (
    <>
      <div
        onClick={() => setSliderForEdit(undefined)}
        className="bg-overlay cursor-pointer absolute inset-0 bg-black-2 bg-opacity-80 block h-full w-full z-[999]"
      ></div>
      <div className="flex flex-col gap-9 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[1000] w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <div className="flex justify-between">
              <h3 className="font-medium text-black dark:text-white">
                <b>{sliderForEdit.title}</b> başlıklı slaytı düzenle
              </h3>
              <span
                className="cursor-pointer text-black-2 dark:text-white text-lg"
                onClick={() => setSliderForEdit(undefined)}
              >
                &times;
              </span>
            </div>
          </div>
          <form
            onSubmit={handleEditSlider}
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

                <div className="w-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Link
                  </label>
                  <input
                    type="url"
                    placeholder="Ör. https://example.com veya hizmet-detayi?id=1"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
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
                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    onChange={(e) => {
                      setImage(e.target.files?.[0] || null);
                    }}
                  />
                  {image ? (
                    <div className="flex flex-col">
                      <img
                        className="h-full w-full aspect-video object-cover rounded"
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                      />
                      <span className="mt-4">
                        Seçilen görsel:{' '}
                        <span className="text-graydark dark:text-white">
                          {image.name}
                        </span>
                      </span>
                    </div>
                  ) : sliderForEdit.image ? (
                    <div className="flex flex-col">
                      <img
                        className="h-full w-full aspect-video object-cover rounded"
                        src={`https://kocaelibetopan.com/uploads/${sliderForEdit.image}`}
                        alt={sliderForEdit.title}
                      />
                      <span className="mt-4">
                        Seçilen görsel:{' '}
                        <span className="text-graydark dark:text-white">
                          {sliderForEdit.title}
                        </span>
                      </span>
                    </div>
                  ) : (
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
                  )}
                </div>
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
