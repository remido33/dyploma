import {FC, useState, useEffect} from 'react';
import styles from '@/styles/calendar.module.css';
import clsx from 'clsx';
import ArrowLeft from '@/public/arrow_left.svg';
import ArrowRight from '@/public/arrow_right.svg';
import ArrowDown from '@/public/arrow_down.svg';
import CalendarIcon from '@/public/calendar.svg';
import Image from 'next/image';

type Props = {
    onDateRangeChange: Function,
}

function formatCalendarDate(dateString: Date | null) {
    if(dateString) {
        const date = new Date(dateString);
        const optionsDate: any = { month: 'short', day: 'numeric' }; 
        return date.toLocaleDateString('en-US', optionsDate)
    }
    return '...';
}


const Calendar: FC<Props> = ({ onDateRangeChange }) => {
    
    const currentYear = new Date().getFullYear();
    const [visible, setVisible] = useState<boolean>(false);
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

    useEffect(() => {
        if(selectedEndDate && selectedStartDate && visible) {
            setVisible(false);
        }
    }, [selectedEndDate, selectedStartDate])

    const handleDateClick = (e: any, date: Date) => {
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            setSelectedStartDate(date);
            setSelectedEndDate(null);
        } else {
            if (date < selectedStartDate) {
                setSelectedStartDate(date);
                setSelectedEndDate(selectedStartDate);
                onDateRangeChange(date, selectedStartDate);
            } else {
                setSelectedEndDate(date);
                onDateRangeChange(selectedStartDate, date);
            }
        }
    };

    const isDateInRange = (date: Date) => {
        if (selectedStartDate && selectedEndDate) {
            return date >= selectedStartDate && date <= selectedEndDate;
        }
        return false;
    };

    const handleMonthChange = (newMonth: number) => {
        setCurrentMonth(newMonth);
    };

    const handleMouseEnter = (date: Date) => {
        if (selectedStartDate && !selectedEndDate) {
            setHoveredDate(date);
        }
    };

    const handleMouseLeave = () => {
        setHoveredDate(null);
    };

    const daysInMonth: JSX.Element[] = [];
    const currentDate: Date = new Date(currentYear, currentMonth, 1);
    const year: number = currentDate.getFullYear();
    const month: number = currentDate.getMonth();
    const daysCount: number = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek: number = new Date(year, month, 1).getDay();

    const dayNames = ['Sn', 'Mn', 'Tu', 'We', 'Th', 'Fr', 'St'];
    const daysOfWeek: JSX.Element[] = dayNames.map((dayName, index) => (
        <div key={index} className={styles.dayName}>
            {dayName}
        </div>
    ));

    const emptyCells = Array.from({ length: firstDayOfWeek }, (_, index) => (
        <div key={`empty-${index}`} className={styles.emptyCell} />
    ));

    const nextMonthAvailable = !(currentMonth + 1 > new Date().getMonth());


    const newDate = new Date();

    for (let day = 1; day <= daysCount; day++) {
        const date: Date = new Date(year, month, day);

        const preSelected = selectedStartDate && date.getTime() === selectedStartDate.getTime();
        const inHoveredRange =
            (selectedStartDate && !selectedEndDate && hoveredDate && date > selectedStartDate && date <= hoveredDate) ||
            (selectedStartDate && !selectedEndDate && hoveredDate && date < selectedStartDate && date >= hoveredDate);

        const isDisabled = date > newDate;

        daysInMonth.push(
            <div
                key={day}
                className={clsx(
                    styles.calendarDate,
                    { [styles.preSelected]: preSelected },
                    { [styles.selectedRange]: isDateInRange(date) },
                    { [styles.hoveredRange]: inHoveredRange },
                    { [styles.disabled]: isDisabled }
                )}
                onClick={(e) => !isDisabled && handleDateClick(e, date)}
                onMouseEnter={() => !isDisabled && handleMouseEnter(date)}
                onMouseLeave={() => !isDisabled && handleMouseLeave()}
            >
                {day}
            </div>
        );
    }

    const onClear = () => {
        setSelectedStartDate(null);
        setSelectedEndDate(null);
    }
    
    const calendarTitle = 
        !selectedEndDate && !selectedStartDate 
            ? 'Last 14 days' 
            : `${formatCalendarDate(selectedStartDate)} - ${formatCalendarDate(selectedEndDate)}`;

    return (
        <div className={styles.rangeDropdown} data-opened={visible}>
            <button 
                className={styles.range} 
                onClick={() => setVisible((prev) => !prev)}
            >
                <div className={styles.rangeTitle}>
                    <div className={styles.calendarIcon}>
                        <Image src={CalendarIcon} alt="Calendar" />
                    </div>
                    <span>
                        {calendarTitle}
                    </span>
                </div>
               <div className={styles.arrowIcon}>
                    <Image src={ArrowDown} alt="Open Calendar" />
               </div>
            </button>
            {visible && (
                <div className={styles.calendar}>
                    <div>
                        <div className={styles.header}>
                            <span className={styles.title}>
                                {
                                    new Date(currentYear, currentMonth)
                                    .toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                                }
                            </span>
                            <div className={styles.btns}>
                                <button onClick={onClear} className={styles.clear}>
                                    clear
                                </button>
                                <button 
                                    className={styles.btn} 
                                    onClick={() => handleMonthChange(currentMonth - 1)}
                                >
                                    <Image src={ArrowLeft} alt="Previous Month" />
                                </button>
                                <button
                                    className={styles.btn}
                                    onClick={() => nextMonthAvailable ? handleMonthChange(currentMonth + 1) : null}
                                    disabled={!nextMonthAvailable}
                                >
                                    <Image src={ArrowRight} alt="Next Month" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.dayNames}>
                        {daysOfWeek}
                    </div>
                    <div className={styles.daysGrid}>
                        {emptyCells}
                        {daysInMonth}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
