"use client";

import { FC, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import DragIcon from '@/public/drag.svg';
import { CSS } from "@dnd-kit/utilities";
import styles from '@/styles/collectionSettings.module.css';
import Image from 'next/image';
import Cta from "@/components/Cta";
import { CollectionType, CollectionModalActionType, UpdateNestedType } from "@/helpers/types";
import { useNotifications } from '@/components/Notifications/Provider';
import EditModal from "./Modal";
import Nested from "./Nested";
import updateStore from "@/helpers/updateStore";
import AddIcon from '@/public/add.svg';

type SortableItemProps = {
    openModal: Function,
    collection: CollectionType,
    updateNestedCollection: ({ parentId, updatedCollections }: UpdateNestedType) => void,
};

const SortableItem: FC<SortableItemProps> = ({ collection, openModal, updateNestedCollection }) => {

    const { id, title, children, loading } = collection;
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <li ref={setNodeRef} style={style} {...attributes} className={styles.draggableItem}>
            <div className={styles.listItem}>
                <span>
                    {title} {loading && <i>(in progress)</i>}
                </span>
                <div className={styles.ctas}>
                    <button onClick={() => openModal({
                        collection,
                        type: 'edit',
                    })}>
                        Edit
                    </button>
                    <button onClick={() => openModal({ 
                        collection,
                        type: 'add nested',
                    })}>
                        <Image src={AddIcon} alt="Add" />
                    </button>
                    <button className={styles.dragHandle} {...listeners}>
                        <Image src={DragIcon} alt="Move" />
                    </button>
                </div>
            </div>

            {!isDragging &&
                <Nested 
                    parentId={collection.id}
                    collections={children}
                    openModal={openModal}
                    updateNestedCollection={updateNestedCollection}
                />
            }
        </li>
    );
};


type Props = {
    storeId: string,
    collections: CollectionType[];
};


const CollectionSettings: FC<Props> = ({ storeId, collections: initalCollections }) => {
    const { pushNotification } = useNotifications();
    const [collections, setCollections] = useState<CollectionType[]>(initalCollections);
    const [modalState, setModalState] = useState<{ 
        isOpen: boolean, 
        collection: null | CollectionType, 
        type: CollectionModalActionType, 
    }>({
        isOpen: false,
        collection: null,
        type: 'edit',
    });

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = collections.findIndex(item => item.id === active.id);
            const newIndex = collections.findIndex(item => item.id === over.id);
            const updatedCollections = arrayMove(collections, oldIndex, newIndex);
            
            try {
                setCollections(updatedCollections);
                await updateStore({ 
                    storeId,
                    key: 'collections', 
                    value: updatedCollections 
                });
            } catch (err) {
                pushNotification('Error updating collection order.', true);
            }
        }
    };

    const openModal = ({ collection, type } : 
        { 
            collection: null | CollectionType, 
            type: CollectionModalActionType,
        }
    ) => {
        setModalState({
            isOpen: true,
            collection,
            type: type,
        });
    };

    const updateNestedCollection = async ({ parentId, updatedCollections }: UpdateNestedType) => {
        let newCollections = [...collections];
        const parentIndex = newCollections.findIndex(({ id }) => id === parentId);
        newCollections[parentIndex].children = updatedCollections;

        await updateStore({
            storeId,
            key: 'collections', 
            value: newCollections,
        });
    }

    return (
        <>
            <DndContext 
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={collections.map(collection => collection.id)}>
                    <ul className={styles.list}>
                        {collections.map((collection) => (
                            <SortableItem
                                key={collection.id}
                                collection={collection}
                                openModal={openModal}
                                updateNestedCollection={updateNestedCollection}
                            />
                        ))}
                        <li className={styles.addBtn}>
                            <Cta
                                variant="black"
                                onClick={() => openModal({ 
                                    collection: null, 
                                    type: 'add' 
                                })}
                            >
                                Add +
                            </Cta>
                        </li>
                    </ul>
                </SortableContext>
            </DndContext>

            <EditModal
                storeId={storeId}
                isOpen={modalState.isOpen}
                onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                collection={modalState.collection}
                type={modalState.type}
                pushNotification={pushNotification}
                collections={collections}
                setCollections={setCollections}
            />
        </>
    );
};

export default CollectionSettings;
