"use client";

import { FC, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import DragIcon from '@/public/drag.svg';
import { CSS } from "@dnd-kit/utilities";
import styles from '@/styles/filterSettings.module.css';
import Image from 'next/image';
import Cta from "@/components/Cta";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import { FilterType } from "@/helpers/types";
import nextApi from "@/utils/nextApi";
import { useNotifications } from '@/components/Notifications/Provider';
import updateStore from "@/helpers/updateStore";

type SortableItemProps = {
    id: string;
    text: string;
    onClick: () => void;
};

const SortableItem: FC<SortableItemProps> = ({ id, text, onClick }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li ref={setNodeRef} style={style} {...attributes} className={styles.draggableItem}>
            <Cta onClick={onClick} variant="transparent" style={{ paddingLeft: 12 }}>
                <span className={styles.dragHandle} {...listeners}>
                    <Image src={DragIcon} alt="Move" />
                </span>
                {text}
            </Cta>
        </li>
    );
};

type Props = {
    storeId: string,
    filters: FilterType[];
};

type ModalSettingsType = {
    id?: string;
    title: string;
    field: string;
};

const FilterSettings: FC<Props> = ({ storeId, filters: initialFilters }) => {
    const { pushNotification, } = useNotifications();
    const [confModalOpen, setConfModalOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState<FilterType[]>(initialFilters);
    const [modalError, setModalError] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const [modalSettings, setModalSettings] = useState<ModalSettingsType>({
        id: undefined,
        title: '',
        field: '',
    });

    const { id: modalId, title: modalTitle, field: modalField } = modalSettings;
    const modalReady = !modalError && modalTitle.trim().length > 0 && modalField.trim().length > 0;

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = filters.findIndex(item => item.id === active.id);
            const newIndex = filters.findIndex(item => item.id === over.id);
            const updatedFilters = arrayMove(filters, oldIndex, newIndex);

            try {
                setFilters(updatedFilters);
                
                await updateStore({
                    storeId,
                    key: 'filters',
                    value: updatedFilters
                });
                
            } catch (err) {
                pushNotification('Error updating filter order.', true);
            }
        }
    };

    const openModal = (settings: ModalSettingsType) => {
        setModalSettings(settings);
        setModalOpen(true);
    };

    const onModalSubmit = async () => {
        if (modalReady) {
            try {
                const newFilter = {
                    id: modalId || '', 
                    title: modalTitle,
                    field: modalField,
                };

                const response = await updateStore({
                    storeId,
                    key: 'filters',
                    value: [...filters.filter(f => f.id !== newFilter.id), newFilter]
                });

                setFilters(response.data.filters);
                setModalOpen(false);
                pushNotification(modalId ? 'Filter successfully changed.' : 'Filter successfully added.');
            } catch (err: any) {
                pushNotification(`Error: ${err.message || 'Value was not updated!'}`, true);
            }
        }
    };

    const onFilterDelete = async () => {
        if(modalId) {
            try {

                const response = await updateStore({
                    storeId,
                    key: 'filters',
                    value: [...filters.filter(f => f.id !== modalId)]
                });
    
                setFilters(response.data.filters);
                setModalOpen(false);
                setConfModalOpen(false);
                pushNotification('Filter successfully deleted.');
            } catch (err: any) {
                pushNotification(`Error: ${err.message || 'Filter was not deleted!'}`, true);
            }
        }
        else {
            pushNotification('Something went wrong. Try to refresh the page.', true);
            setConfModalOpen(false);
            setModalOpen(false);
        }
    }

    const onInputChange = (value: string, label: keyof ModalSettingsType, error: string | null) => {
        setModalSettings(prev => ({ ...prev, [label]: value }));
        setModalError(!!error);
    };

    return (
        <>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={filters.map(filter => filter.id)} strategy={horizontalListSortingStrategy}>
                    <ul className={styles.list}>
                        {filters.map(({ id, title, field }) => (
                            <SortableItem
                                key={id}
                                id={id}
                                text={title}
                                onClick={() => openModal({ id, title, field })}
                            />
                        ))}
                        <li>
                            <Cta
                                variant="black"
                                onClick={() => openModal({ title: '', field: '' })}
                            >
                                Add +
                            </Cta>
                        </li>
                    </ul>
                </SortableContext>
            </DndContext>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <div className={styles.modal}>
                    <h3>Filter settings</h3>
                    <p>Provide title with corresponding field.</p>
                    <div className={styles.inputs}>
                        <Input
                            label="title"
                            placeholder="Title"
                            value={modalTitle}
                            setValue={(value, error) => onInputChange(value, 'title', error)}
                            labelAlwaysVisible={true}
                        />
                        <Input
                            label="field"
                            placeholder="Field"
                            value={modalField}
                            setValue={(value, error) => onInputChange(value, 'field', error)}
                            labelAlwaysVisible={true}
                        />
                    </div>
                    <div className={styles.modalCtas}>
                        {modalId && (
                            <button 
                                className={styles.deleteBtn}
                                onClick={() => setConfModalOpen(true)}
                            >
                                Delete filter
                            </button>
                        )}
                        <Cta variant="black" onClick={onModalSubmit} disabled={!modalReady}>
                            Submit
                        </Cta>
                    </div>
                </div>
            </Modal>

            <ConfirmationModal 
                isOpen={confModalOpen}
                onClose={() => setConfModalOpen(false)}
                onFilterDelete={onFilterDelete}
                title={modalTitle}
            />
        </>
    );
};

type ConfirmationModalProps = {
    isOpen: boolean,
    onClose: () => void,
    onFilterDelete: () => void,
    title: string,
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({ isOpen, onClose, onFilterDelete, title }) => {
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.modal}>
                <h2>Delete confirmation</h2>
                <p>
                    Are you sure you want to delete <b>"{title}"</b> filter?<br/>
                </p>
                <div className={styles.modalCtas}>
                    <Cta variant="transparent" style={{ marginRight: 12, }} onClick={onClose}>
                        Cancel
                    </Cta>
                    <Cta variant="delete" onClick={onFilterDelete}>
                        Delete
                    </Cta>
                </div>
            </div>
        </Modal>
    )
}

export default FilterSettings;
