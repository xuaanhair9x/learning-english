import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import api from '../../api';
import './AdminCrudPage.css';

export default function AdminCrudPage({ endpoint, title, columns }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    // Fetch data
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/${endpoint}`);
            setData(res.data || []);
        } catch (err) {
            console.error(`Failed to fetch ${endpoint}`, err);
            alert(`Error: ${err.response?.data?.error || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Reset state when endpoint changes
        setEditingItem(null);
        setIsModalOpen(false);
    }, [endpoint]);

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        if (item) {
            setFormData({ ...item });
        } else {
            // init empty form
            const emptyObj = {};
            columns.forEach(col => emptyObj[col.key] = col.type === 'number' ? 0 : '');
            setFormData(emptyObj);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({});
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                // Update
                await api.put(`/admin/${endpoint}/${editingItem.id}`, formData);
            } else {
                // Create
                await api.post(`/admin/${endpoint}`, formData);
            }
            handleCloseModal();
            fetchData();
        } catch (err) {
            alert(`Save failed: ${err.response?.data?.error || err.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.delete(`/admin/${endpoint}/${id}`);
            fetchData();
        } catch (err) {
            alert(`Delete failed: ${err.response?.data?.error || err.message}`);
        }
    };

    return (
        <div className="admin-crud-container">
            <div className="admin-crud-header">
                <h1 className="admin-page-title">{title}</h1>
                <button className="admin-btn-primary" onClick={() => handleOpenModal()}>
                    + Add New
                </button>
            </div>

            {loading ? (
                <div className="admin-loading">Loading data...</div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                {columns.map(col => <th key={col.key}>{col.label}</th>)}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 2} className="admin-table-empty">
                                        No data available.
                                    </td>
                                </tr>
                            ) : data.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    {columns.map(col => (
                                        <td key={col.key}>
                                            <div className="admin-cell-truncate" title={item[col.key]}>
                                                {String(item[col.key] || '')}
                                            </div>
                                        </td>
                                    ))}
                                    <td>
                                        <div className="admin-actions">
                                            <button className="admin-btn-edit" onClick={() => handleOpenModal(item)}>Edit</button>
                                            <button className="admin-btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2>{editingItem ? 'Edit Item' : 'New Item'}</h2>
                        <form onSubmit={handleSubmit} className="admin-form">
                            {columns.map(col => (
                                <div className="admin-form-group" key={col.key}>
                                    <label>{col.label}</label>
                                    {col.type === 'textarea' ? (
                                        <textarea
                                            name={col.key}
                                            value={formData[col.key] || ''}
                                            onChange={handleInputChange}
                                            required={col.required}
                                        />
                                    ) : col.type === 'markdown' ? (
                                        <div data-color-mode="light">
                                            <MDEditor
                                                value={formData[col.key] || ''}
                                                onChange={(val) => setFormData(prev => ({ ...prev, [col.key]: val || '' }))}
                                                textareaProps={{
                                                    placeholder: 'Enter markdown text...'
                                                }}
                                                height={300}
                                            />
                                        </div>
                                    ) : (
                                        <input
                                            type={col.type || 'text'}
                                            name={col.key}
                                            value={formData[col.key] === undefined ? '' : formData[col.key]}
                                            onChange={handleInputChange}
                                            required={col.required}
                                        />
                                    )}
                                </div>
                            ))}
                            <div className="admin-modal-actions">
                                <button type="button" className="admin-btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="admin-btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
