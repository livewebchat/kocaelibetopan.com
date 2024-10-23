import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const HeroSlider = () => {
  const handleAddSlider = (e: any) => {
    console.log(e);
  };

  return (
    <>
      <Breadcrumb pageName="Ana Sayfa Slaytları" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Slayt Ekle
              </h3>
            </div>
            <form action="POST" onSubmit={handleAddSlider}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6">
                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Başlık
                    </label>
                    <input
                      type="text"
                      placeholder="Ör. Betopan"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2.5 block text-black dark:text-white">
                      Açıklama
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Ör. Betopan bir yapının temelinden çatısına kadar tüm iç ve dış mekanlarında kullanılabilen, fonksiyonel özelliklere sahip, çimentolu yonga levhadır."
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Görsel <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="file"
                    placeholder="Enter your email address"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  />
                </div>

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSlider;
