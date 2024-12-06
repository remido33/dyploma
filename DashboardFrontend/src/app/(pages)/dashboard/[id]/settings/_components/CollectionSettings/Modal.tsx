
import Modal from '@/components/Modal';
import { FC, useEffect, useState } from 'react';
import styles from '@/styles/collectionSettings.module.css';
import Input from '@/components/Input';
import Cta from '@/components/Cta';
import { CollectionType, CollectionModalActionType } from '@/helpers/types';
import updateStore from '@/helpers/updateStore';
import Loading from '@/components/Loading';

type Props = {
    storeId: string,
    isOpen: boolean,
    onClose: () => void,
    collection: CollectionType | null,
    pushNotification: (message: string, isError?: boolean) => void,
    type: CollectionModalActionType,
    collections: CollectionType[],
    setCollections: (collections: CollectionType[]) => void,
};

const notificationMapping: { [key in CollectionModalActionType]: string } = {
    'edit': 'Collection successfully edited.',
    'add': 'Collection added.',
    'add nested': 'Nested collection added.',
    'edit nested': 'Nested collection successfully edited.',
};

const modalTitleMapping: { [key in CollectionModalActionType]: string } = {
    'edit': 'Edit collection',
    'add': 'Add collection',
    'add nested': 'Add nested collection',
    'edit nested': 'Edit nested collection',
};

const EditModal: FC<Props> = ({
    storeId,
    isOpen,
    onClose,
    collections,
    collection,
    pushNotification,
    type,
    setCollections,
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [modalError, setModalError] = useState<boolean>(false);
    const [confModalOpen, setConfModalOpen] = useState<boolean>(false);
    const [inputValues, setInputValues] = useState<{ title: string; ref: string }>({
        title: '',
        ref: '',
    });

    useEffect(() => {
        if (type.includes('edit') && collection) {
            setInputValues({
                ref: collection.ref || '',
                title: collection.title || '',
            });
        } else {
            setInputValues({ title: '', ref: '' });
        }
        setModalError(false);
    }, [collection, type]);

    const { ref, title } = inputValues;
    const modalReady = !modalError && ref.trim().length > 0 && title.trim().length > 0;

    const handleInputChange = (value: string, key: keyof typeof inputValues, error: string | null) => {
        setInputValues(prev => ({ ...prev, [key]: value }));
        setModalError(!!error);
    };
    

    const handleModalSubmit = async () => {
        if (!modalReady) return;

        const newCollection = { title, ref };

        try {
            let updatedCollections = [...collections];

            if (type === 'add') {
                updatedCollections.push({ id: '', ...newCollection, children: [], });
            } else if (type === 'edit' && collection) {
                const index = updatedCollections.findIndex(({ id }) => id === collection.id);
                updatedCollections[index] = { ...updatedCollections[index], ...newCollection };
            } else if (type === 'add nested' && collection) {
                const index = updatedCollections.findIndex(({ id }) => id === collection.id);
                updatedCollections[index].children.push({ id: '', ...newCollection });
            } else if (type === 'edit nested' && collection) {
                const parentIndex = updatedCollections.findIndex(({ id }) => id === collection.parentId);
                const nestedIndex = updatedCollections[parentIndex].children.findIndex(({ id }) => id === collection.id);
                updatedCollections[parentIndex].children[nestedIndex] = { ...updatedCollections[parentIndex].children[nestedIndex], ...newCollection };
            }
            
            setLoading(true);
            updateStore({ 
                storeId, 
                key: 'collections', 
                value: updatedCollections 
            });
            setLoading(false);
            setCollections(updatedCollections);
            onClose();
            pushNotification(notificationMapping[type]);
            setInputValues({
                title: '',
                ref: '',
            });
        } catch (err: any) {
            pushNotification(`Error: ${err.message || 'Value was not updated!'}`, true);
        }
    };

    const handleCollectionDelete = async () => {
        if (!collection || !type.includes('edit')) {
            pushNotification('Something went wrong. Try refreshing the page.', true);
            setConfModalOpen(false);
            onClose();
            return;
        }

        try {
            let updatedCollections = [...collections];

            if (collection.parentId) {
                const parentIndex = updatedCollections.findIndex(({ id }) => id === collection.parentId);
                updatedCollections[parentIndex].children = updatedCollections[parentIndex].children.filter(({ id }) => id !== collection.id);
            } else {
                updatedCollections = updatedCollections.filter(({ id }) => id !== collection.id);
            }
            
            setLoading(true);
            const response = await updateStore({ storeId, key: 'collections', value: updatedCollections });
            setLoading(false);
            setCollections(response.data.collections);
            onClose();
            setConfModalOpen(false);
            pushNotification('Collection successfully deleted.');
        } catch (err: any) {
            pushNotification(`Error: ${err.message || 'Collection was not deleted!'}`, true);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className={styles.modal}>
                    <h3>{modalTitleMapping[type]}</h3>
                    <p>Provide title and id for the collection.</p>
                    <div className={styles.inputs}>
                        <Input
                            label="title"
                            placeholder="Title"
                            value={title}
                            setValue={(value, error) => handleInputChange(value, 'title', error)}
                            labelAlwaysVisible={true}
                        />
                        <Input
                            label="ref id"
                            placeholder="12345678"
                            value={ref}
                            setValue={(value, error) => handleInputChange(value, 'ref', error)}
                            labelAlwaysVisible={true}
                        />
                    </div>
                    <div className={styles.modalCtas}>
                        {type.includes('edit') && collection && (
                            <button
                                className={styles.deleteBtn}
                                onClick={() => setConfModalOpen(true)}
                            >
                                Delete collection
                            </button>
                        )}
                        <Cta variant="black" onClick={handleModalSubmit} disabled={!modalReady}>
                            Submit
                        </Cta>
                    </div>
                </div>
            </Modal>

            {type.includes('edit') && collection && (
                <ConfirmationModal
                    isOpen={confModalOpen}
                    onClose={() => setConfModalOpen(false)}
                    onCollectionDelete={handleCollectionDelete}
                    title={collection.title}
                />
            )}

            {loading && <Loading />}
        </>
    );
};

type ConfirmationModalProps = {
    isOpen: boolean,
    onClose: () => void,
    onCollectionDelete: () => void,
    title: string,
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({ isOpen, onClose, onCollectionDelete, title }) => {
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.modal}>
                <h2>Delete confirmation</h2>
                <p>
                    Are you sure you want to delete <b>"{title}"</b> collection?<br/>
                </p>
                <div className={styles.modalCtas}>
                    <Cta variant="transparent" style={{ marginRight: 12, }} onClick={onClose}>
                        Cancel
                    </Cta>
                    <Cta variant="delete" onClick={onCollectionDelete}>
                        Delete
                    </Cta>
                </div>
            </div>
        </Modal>
    )
};

export default EditModal;