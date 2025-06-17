import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Mail, Calendar, User, AlertCircle, X, ChevronUp, ChevronDown } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import Spinner from '../components/Spinner/Spinner';
import '../styles/messagesList.css';

export default function MessagesList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, messageId: null, messageSubject: '' });
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    setLoading(true);
    axios
      .get('/api/messages')
      .then(({ data }) => setMessages(data))
      .catch(() => setError('Impossible de charger les messages.'))
      .finally(() => setLoading(false));
  };

  const openDeleteModal = (messageId, messageSubject) => {
    setDeleteModal({ isOpen: true, messageId, messageSubject });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, messageId: null, messageSubject: '' });
  };

  const handleDelete = async () => {
    const messageId = deleteModal.messageId;
    if (!messageId) return;

    setDeletingIds(prev => new Set(prev).add(messageId));
    closeDeleteModal();

    try {
      await axios.delete(`/api/messages/${messageId}`);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      notifications.show({
        title: 'Message supprimé',
        message: 'Le message a été supprimé avec succès.',
        color: 'teal',
      });
    } catch (error) {
      notifications.show({
        title: 'Erreur',
        message: 'Erreur lors de la suppression du message.',
        color: 'red',
      });
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short'
      });
    }

    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sort messages based on selected order
  const sortedMessages = [...messages].sort((a, b) =>
    sortOrder === 'asc'
      ? new Date(a.created_at) - new Date(b.created_at)
      : new Date(b.created_at) - new Date(a.created_at)
  );

  if (loading) return (
    <div className="messages-loading">
      <Spinner />
    </div>
  );

  if (error) return (
    <div className="messages-error">
      <AlertCircle size={48} />
      <p>{error}</p>
      <button onClick={fetchMessages} className="retry-button">
        Réessayer
      </button>
    </div>
  );

  return (
    <>
      <div className="messages-page">
        <div className="messages-header">
          <h1>
            <Mail size={28} />
            Messages reçus
          </h1>
          <div className="header-actions">
            <span className="messages-count">
              {messages.length} message{messages.length > 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="sort-button"
              title={`Trier par date ${sortOrder === 'asc' ? 'descendant' : 'ascendant'}`}
            >
              {sortOrder === 'asc' ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>
        </div>

        <div className="messages-container">
          {sortedMessages.length === 0 ? (
            <div className="no-messages">
              <Mail size={64} />
              <h3>Aucun message</h3>
              <p>Vous n'avez reçu aucun message pour le moment.</p>
            </div>
          ) : (
            sortedMessages.map(msg => (
              <div key={msg.id} className="message-card">
                <div className="message-card-header">
                  <div className="message-subject">
                    <Mail size={18} className="subject-icon" />
                    <h3>{msg.subject}</h3>
                  </div>
                  <div className="message-actions">
                    <div className="message-date">
                      <Calendar size={16} />
                      <time>{formatDate(msg.created_at)}</time>
                    </div>
                    <button
                      onClick={() => openDeleteModal(msg.id, msg.subject)}
                      className="delete-button"
                      disabled={deletingIds.has(msg.id)}
                      title="Supprimer le message"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="message-body">
                  <p>{msg.message}</p>
                </div>

                <div className="message-footer">
                  <div className="sender-info">
                    <User size={16} />
                    <span className="sender-name">{msg.name}</span>
                    <span className="sender-email">{msg.email}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {deleteModal.isOpen && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button className="modal-close" onClick={closeDeleteModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-icon">
                <AlertCircle size={48} />
              </div>
              <p>Êtes-vous sûr de vouloir supprimer ce message ?</p>
              <div className="message-preview">
                <strong>"{deleteModal.messageSubject}"</strong>
              </div>
              <p className="modal-warning">Cette action est irréversible.</p>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={closeDeleteModal}>
                Annuler
              </button>
              <button className="confirm-button" onClick={handleDelete}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
