import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ContactMessage, ContactMessageStatus } from './_models';
import {
  getContactMessages,
  updateContactMessage,
  deleteContactMessage,
} from './_requests';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    ContactMessageStatus | 'all'
  >('all');
  const [adminNotes, setAdminNotes] = useState('');
  const [repliedBy, setRepliedBy] = useState('');

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getContactMessages();
      setMessages(data);
    } catch (error) {
      toast.error('Mesajlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusUpdate = async (
    id: number,
    status: ContactMessageStatus,
  ) => {
    await toast.promise(
      updateContactMessage(id, {
        status,
        admin_notes: adminNotes,
        replied_by: repliedBy,
      }),
      {
        loading: 'Mesaj durumu güncelleniyor...',
        success: 'Mesaj durumu güncellendi',
        error: 'Durum güncellenirken hata oluştu',
      },
    );
    fetchMessages();
    setShowModal(false);
    setAdminNotes('');
    setRepliedBy('');
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      await toast.promise(deleteContactMessage(id), {
        loading: 'Mesaj siliniyor...',
        success: 'Mesaj silindi',
        error: 'Mesaj silinirken hata oluştu',
      });
      fetchMessages();
    }
  };

  const openModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setAdminNotes(message.admin_notes || '');
    setRepliedBy(message.replied_by || '');
    setShowModal(true);
  };

  const filteredMessages = messages.filter(
    (message) => filterStatus === 'all' || message.status === filterStatus,
  );

  const getStatusBadge = (status: ContactMessageStatus) => {
    const statusConfig = {
      new: { label: 'Yeni', className: 'bg-red-100 text-red-800' },
      read: { label: 'Okundu', className: 'bg-yellow-100 text-yellow-800' },
      replied: {
        label: 'Yanıtlandı',
        className: 'bg-green-100 text-green-800',
      },
      closed: { label: 'Kapatıldı', className: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="İletişim Mesajları" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="px-4 py-6 md:px-6 xl:px-7.5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="text-xl font-semibold text-black dark:text-white">
                İletişim Mesajları ({filteredMessages.length})
              </h4>

              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(
                      e.target.value as ContactMessageStatus | 'all',
                    )
                  }
                  className="px-3 py-2 border border-stroke rounded-md dark:border-strokedark dark:bg-boxdark"
                >
                  <option value="all">Tümü</option>
                  <option value="new">Yeni</option>
                  <option value="read">Okundu</option>
                  <option value="replied">Yanıtlandı</option>
                  <option value="closed">Kapatıldı</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 border-t border-stroke dark:border-strokedark">
            {filteredMessages.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                Henüz mesaj bulunmuyor.
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className="grid grid-cols-1 sm:grid-cols-5 border-b border-stroke dark:border-strokedark p-4 hover:bg-gray-50 dark:hover:bg-boxdark"
                >
                  <div className="sm:col-span-2">
                    <div className="flex items-center gap-3">
                      <div>
                        <h5 className="font-medium text-black dark:text-white">
                          {message.name}
                        </h5>
                        <p className="text-sm text-gray-500">{message.email}</p>
                        {message.phone && (
                          <p className="text-sm text-gray-500">
                            {message.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {message.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(message.created_at)}
                    </p>
                  </div>

                  <div className="sm:col-span-1 flex items-center justify-between sm:justify-end gap-2">
                    {getStatusBadge(message.status)}
                    <div className="flex gap-1">
                      <button
                        onClick={() => openModal(message)}
                        className="text-primary hover:text-primary-dark"
                        title="Detayları Görüntüle"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Sil"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-boxdark rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Mesaj Detayları</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
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
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-black dark:text-white">
                  {selectedMessage.name}
                </h4>
                <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                {selectedMessage.phone && (
                  <p className="text-sm text-gray-500">
                    {selectedMessage.phone}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(selectedMessage.created_at)}
                </p>
              </div>

              <div>
                <h5 className="font-medium mb-2">Mesaj:</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Admin Notları:
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full p-2 border border-stroke rounded-md dark:border-strokedark dark:bg-boxdark"
                  rows={3}
                  placeholder="Admin notları..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Yanıtlayan:
                </label>
                <input
                  type="text"
                  value={repliedBy}
                  onChange={(e) => setRepliedBy(e.target.value)}
                  className="w-full p-2 border border-stroke rounded-md dark:border-strokedark dark:bg-boxdark"
                  placeholder="Yanıtlayan kişi..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusUpdate(selectedMessage.id, 'read')}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark hover:bg-opacity-90"
                >
                  Okundu Olarak İşaretle
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(selectedMessage.id, 'replied')
                  }
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-opacity-90"
                >
                  Yanıtlandı
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(selectedMessage.id, 'closed')
                  }
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-opacity-90"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactMessages;
