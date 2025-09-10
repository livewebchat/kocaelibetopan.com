import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { getAboutPage, updateAboutPage } from './_requests';
import { AboutPage } from './_models';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const About: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutPage | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAboutPage = async () => {
    try {
      const data = await getAboutPage();
      setAboutData(data);
      setTitle(data.title || 'Hakkımızda');
      setContent(data.content || '');
    } catch (error) {
      console.error('About page fetch error:', error);
      toast.error('Hakkımızda sayfası yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Başlık ve içerik alanları zorunludur');
      return;
    }

    await toast.promise(
      updateAboutPage({
        title: title.trim(),
        content: content.trim(),
      }),
      {
        loading: 'Hakkımızda sayfası güncelleniyor...',
        success: (msg) => msg,
        error: (err) => err.message,
      },
    );

    fetchAboutPage();
  };

  useEffect(() => {
    fetchAboutPage();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Hakkımızda Sayfası Düzenle
          </h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-4.5 flex flex-col gap-6">
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Başlık <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ör. Hakkımızda"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  İçerik <span className="text-meta-1">*</span>
                </label>

                <ReactQuill
                  value={content}
                  onChange={setContent}
                  theme="snow"
                  style={{ minHeight: '300px' }}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'script': 'sub'}, { 'script': 'super' }],
                      [{ 'indent': '-1'}, { 'indent': '+1' }],
                      [{ 'direction': 'rtl' }],
                      [{ 'size': ['small', false, 'large', 'huge'] }],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'font': [] }],
                      [{ 'align': [] }],
                      ['link', 'image', 'video'],
                      ['clean']
                    ],
                  }}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-6"
            >
              Güncelle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};