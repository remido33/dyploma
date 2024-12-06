"use client";

import { FC } from "react"
import DatabaseIcon from '@/public/database.svg';
import AlarmIcon from '@/public/alarm.svg';
import Image from 'next/image';
import Link from "next/link";
import styles from '@/styles/chartError.module.css';

type Props = {
    isError: boolean
}

const ChartError: FC<Props> = ({ isError }) => {
    return (
        <div className={styles.wrapper}>
            {
                isError ? 
                    <> 
                        <Image src={AlarmIcon} alt="Alarm" />
                        <span>
                            Error loading data! <br/> Try to refresh the page or <Link href="#">contact us</Link>.
                        </span>
                    </> : 
                    <>
                        <Image src={DatabaseIcon} alt="Database" />
                        <span>
                            No data found for this date range.
                        </span>
                    </>
            }
        </div>
    )
};

export default ChartError;