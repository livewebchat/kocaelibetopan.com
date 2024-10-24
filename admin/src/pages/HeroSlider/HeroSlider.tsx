import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

type Sliders = {
  id: number;
  image: string;
  title: string;
  description: string;
}[];

const HeroSlider = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [currentSliders, setCurrentSliders] = useState<Sliders>([]);

  const fetchSliders = async () => {
    const restSliders = await fetch(
      'https://api.kocaelibetopan.com/hero_sliders',
    ).then((res) => res.json());

    setCurrentSliders(restSliders);
  };

  const handleAddSliderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert('Please select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
      const response = await fetch(
        'https://api.kocaelibetopan.com/hero_sliders',
        {
          method: 'POST',
          body: formData,
        },
      );

      const data = await response.json();
      if (response.ok) {
        alert('Slider added successfully!');
        fetchSliders();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error uploading slider:', error);
    }
  };

  const handleDeleteSlider = async (sliderId: number) => {
    try {
      const response = await fetch(
        `https://api.kocaelibetopan.com/hero_sliders/${sliderId}`,
        {
          method: 'DELETE',
        },
      );

      if (response.ok) {
        alert('Slider deleted successfully!');
        fetchSliders();
      } else {
        const data = await response.json();
        alert(`Error deleting slider: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting slider:', error);
      alert('An error occurred while deleting the slider.');
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  return (
    <>
      <Breadcrumb pageName="Ana Sayfa Slaytları" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Slayt Ekle
              </h3>
            </div>
            <form onSubmit={handleAddSliderSubmit}>
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
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
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

        {currentSliders.length ? (
          <div className="flex flex-col gap-9">
            {currentSliders.map((slider, i) => (
              <div key={i}>
                <img
                  src={`https://kocaelibetopan.com${slider.image}`}
                  alt={slider.title}
                />
                {slider.title}
                {slider.description}
                <button onClick={() => handleDeleteSlider(slider.id)}>
                  &times;
                </button>
              </div>
            ))}
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  );
};

export default HeroSlider;
