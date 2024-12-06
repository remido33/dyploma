"use client";

import { FC, useState, useEffect } from "react";
import styles from "@/styles/table.module.css";
import Modal from "./Modal";
import ChartError from "./ChartError";
import { ProductTypeAnalytic, TableAnalytic } from "@/helpers/types";

type Props = {
  title: string;
  valueLabel: string;
  data: any;
  productTypeAnalytic?: boolean;
};

const Table: FC<Props> = ({
  title = "Analytics Table",
  valueLabel = "",
  data: passedData,
  productTypeAnalytic = false,
}) => {
  const [data, setData] = useState(passedData);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setData(passedData);
  }, [passedData]);

  if (!data || data.error || data.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <span className={styles.valueLabel}>{valueLabel}</span>
        </div>
        <ChartError isError={data?.error || !!data?.length} />
      </div>
    );
  };
  

  const renderList = (items: any[]) =>
    items.map(({ id, title, value, count }: any, index: number) => (
        <li key={id || index}>
        {productTypeAnalytic ? (
            <a 
                href={`https://admin.shopify.com/store/${localStorage.getItem('storeName')}/products/${id}`} 
                target="_blank" 
                rel="noopener noreferrer"
            >
                <span>{title}</span>
            </a>
        ) : (
            <span>{value?.length ? value : "empty"}</span>
        )}
        <span>{count}</span>
        </li>
    ));


  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <span className={styles.valueLabel}>{valueLabel}</span>
        </div>
        <ul>{renderList(data.slice(0, 7))}</ul>
        {data.length > 7 && (
          <div className={styles.footer}>
            <button onClick={() => setModalVisible(true)}>View more</button>
          </div>
        )}
      </div>
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <span>{title}</span>
            <span>{valueLabel}</span>
          </div>
          <ul>{renderList(data)}</ul>
        </div>
      </Modal>
    </>
  );
};

export default Table;
