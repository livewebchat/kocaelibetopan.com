import { useEffect, useRef, useState } from 'react';

import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import toast from 'react-hot-toast';

import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { EditService } from './EditService';
import { addNewService, getAllServices, removeServiceById } from './_requests';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const Services = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [htmlContent, setHtmlContent] = useState('');
  const [loadingServices, setLoadingServices] = useState<boolean>(true);
  const [currentServices, setCurrentServices] = useState<Service[]>([]);
  const [serviceForEdit, setServiceForEdit] = useState<Service>();

  const currentServicesRef = useRef<SwiperRef>(null);

  const fetchServices = async () => {
    setCurrentServices(await getAllServices());
    setLoadingServices(false);
  };

  const clearAddServiceForm = () => {
    setTitle('');
    setDescription('');
    setImages([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImages([...images, ...files]);
  };

  const handleAddServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!images) {
      toast.error('Lütfen geçerli bir görsel seçin');
      return;
    }

    await toast.promise(
      addNewService({ title, description, images, htmlContent }),
      {
        loading: 'Hizmet ekleniyor...',
        success: (msg) => msg,
        error: (err) => err.message,
      },
    );

    clearAddServiceForm();
    await fetchServices();

    setTimeout(() => {
      currentServicesRef.current?.swiper.slideTo(currentServices.length);
    }, 200);
  };

  const handleDeleteService = async (serviceId: string) => {
    await toast.promise(removeServiceById(serviceId), {
      loading: 'Hizmet siliniyor...',
      success: (msg) => msg,
      error: (err) => err.message,
    });

    fetchServices();
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <>
      <Breadcrumb pageName="Geçmiş Hizmetler" />
      <h2 className="font-bold text-xl text-gray-600 dark:text-white mb-5">
        Mevcut Hizmetler
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {loadingServices ? (
          <div className="flex justify-center p-10 border border-stroke dark:border-strokedark bg-white shadow-default dark:bg-boxdark h-fit">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
        ) : currentServices.length ? (
          <Swiper
            spaceBetween={10}
            slidesPerView={2}
            className="w-full p-10 border border-stroke dark:border-strokedark bg-white shadow-default dark:bg-boxdark h-fit"
            modules={[Navigation, Pagination]}
            pagination={true}
            ref={currentServicesRef}
          >
            {currentServices.map((service) => (
              <SwiperSlide
                className="cursor-grab active:cursor-grabbing group"
                key={service.id}
              >
                <button
                  onClick={() => setServiceForEdit(service)}
                  className="cursor-pointer opacity-0 group-hover:opacity-100 absolute top-[5px] left-[7px] z-1 text-white bg-gray-700 rounded-full p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-2 2v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    toast(
                      (t) => (
                        <div className="flex flex-col gap-4">
                          <span>
                            <b>{service.title}</b> başlıklı hizmet silinsin mi?
                          </span>
                          <div className="flex gap-2 justify-end">
                            <button
                              className="p-2 bg-gray-600 text-white text-[15px] rounded min-w-25"
                              onClick={() => toast.dismiss(t.id)}
                            >
                              Vazgeç
                            </button>
                            <button
                              className="p-2 bg-danger text-white text-[15px] rounded min-w-25"
                              onClick={() => {
                                handleDeleteService(service.id);
                                toast.dismiss(t.id);
                              }}
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                      ),
                      { duration: 10000 },
                    );
                  }}
                  className="cursor-pointer opacity-0 group-hover:opacity-100 absolute top-[5px] right-[7px] z-1 text-white bg-danger rounded-full p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"
                    />
                  </svg>
                </button>
                <img
                  className="w-full aspect-video object-cover"
                  src={`https://kocaelibetopan.com/uploads/${service.images[0]}`}
                  alt={service.title}
                />
                <h3 className="text-xl text-black-2 dark:text-white mt-5 w-full overflow-hidden text-ellipsis line-clamp-1">
                  {service.title}
                </h3>
                <p className="mt-2 text-ellipsis line-clamp-3">
                  {service.description}
                </p>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex justify-center p-10 border border-stroke dark:border-strokedark bg-white shadow-default dark:bg-boxdark h-fit">
            Henüz bir hizmet eklemediniz. Lütfen hizmet ekleyin.
          </div>
        )}

        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Yeni Hizmet Ekle
              </h3>
            </div>
            <form onSubmit={handleAddServiceSubmit}>
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
                      required
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

                  {images?.length > 0 ? (
                    <div className="flex flex-wrap gap-3 relative z-99">
                      {images.map((img: any, idx: any) => (
                        <div className="relative" key={idx}>
                          <button
                            type="button"
                            className="flex justify-center items-center absolute h-full w-full bg-white bg-opacity-0 hover:bg-opacity-50 transition-all group"
                            onClick={() => {
                              setImages(images.filter((i: any) => i !== img));
                            }}
                          >
                            <span className="flex justify-center items-center h-5 w-5 bg-danger rounded-full text-white opacity-0 group-hover:opacity-100 transition-all">
                              &times;
                            </span>
                          </button>
                          <img
                            className="h-24 w-24 object-cover rounded"
                            src={URL.createObjectURL(img)}
                            alt={img.name}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    ''
                  )}
                </div>

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {serviceForEdit && (
        <EditService
          serviceForEdit={serviceForEdit}
          setServiceForEdit={setServiceForEdit}
          fetchServices={fetchServices}
        />
      )}
    </>
  );
};
