import { FC, useEffect, useState } from "react"
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { NestedCollectionType, UpdateNestedType } from "@/helpers/types";
import { CSS } from "@dnd-kit/utilities";
import styles from '@/styles/collectionSettings.module.css';
import Image from 'next/image';
import DragIcon from '@/public/drag.svg';
import { useNotifications } from '@/components/Notifications/Provider';
import updateStore from "@/helpers/updateStore";

type SortableItemProps = {
    parentId: string,
    collection: NestedCollectionType,
    openModal: Function,
};

const SortableItem: FC<SortableItemProps> = ({ parentId, collection, openModal }) => {

    const { id, title, loading, }: NestedCollectionType = collection;
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li ref={setNodeRef} style={style} {...attributes} className={styles.draggableItem}>
            <div className={styles.listItem}>
                <span>
                    {title} {loading && <i>(in progress)</i>}
                </span>
                <div className={styles.ctas}>
                    <button className={styles.editBtn} onClick={() => openModal({ 
                        collection: {
                            ...collection,
                            parentId,
                        },
                        type: 'edit nested',
                     })}>
                        Edit
                    </button>
                    <span className={styles.dragHandle} {...listeners}>
                        <Image src={DragIcon} alt="Move" />
                    </span>
                </div>
            </div>
        </li>
    );
};

type Props = {
    parentId: string,
    collections: NestedCollectionType[],
    openModal: Function,
    updateNestedCollection: ({ parentId, updatedCollections }: UpdateNestedType) => void,
};

const Nested: FC<Props> = ({ parentId, collections: initalCollections = [], openModal, updateNestedCollection }) => {

    const { pushNotification } = useNotifications();
    const [collections, setCollections] = useState<NestedCollectionType[]>(initalCollections);

    useEffect(() => {
        setCollections(initalCollections);
    }, [initalCollections])

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = collections.findIndex(item => item.id === active.id);
            const newIndex = collections.findIndex(item => item.id === over.id);
            const updatedCollections = arrayMove(collections, oldIndex, newIndex);

            try {
                setCollections(updatedCollections);
                
                updateNestedCollection({
                    parentId,
                    updatedCollections,
                });
                
            } catch (err) {
                pushNotification('Error updating collection order.', true);
            }
        }
    };

    return collections?.length ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={collections.map(collection => collection.id)}>
                <ul className={styles.list}>
                    {collections.map((collection) => (
                        <SortableItem
                            key={collection.id}
                            collection={collection}
                            openModal={openModal}
                            parentId={parentId}
                        />
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    ) : <></>
};

export default Nested;