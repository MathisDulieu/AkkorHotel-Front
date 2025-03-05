import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DatePicker = () => {
    const [showDatepicker, setShowDatepicker] = useState(false);
    const [datepickerValue, setDatepickerValue] = useState('');
    const [month, setMonth] = useState(0);
    const [year, setYear] = useState(0);
    const [blankDays, setBlankDays] = useState([]);
    const [noOfDays, setNoOfDays] = useState([]);

    useEffect(() => {
        initDate();
        getNoOfDays();
    }, []);

    const initDate = () => {
        const today = new Date();
        setMonth(today.getMonth());
        setYear(today.getFullYear());
        setDatepickerValue(today.toDateString());
    };

    const isToday = (date) => {
        const today = new Date();
        const d = new Date(year, month, date);
        return today.toDateString() === d.toDateString();
    };

    const getDateValue = (date) => {
        const selectedDate = new Date(year, month, date);
        setDatepickerValue(selectedDate.toDateString());
        setShowDatepicker(false);
    };

    const getNoOfDays = () => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dayOfWeek = new Date(year, month).getDay();

        const blankdaysArray = Array.from({ length: dayOfWeek }, (_, i) => i + 1);
        const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        setBlankDays(blankdaysArray);
        setNoOfDays(daysArray);
    };

    const changePrevMonth = () => {
        if (month > 0) {
            setMonth(month - 1);
            getNoOfDays();
        }
    };

    const changeNextMonth = () => {
        if (month < 11) {
            setMonth(month + 1);
            getNoOfDays();
        }
    };

    return (
        <div className="relative">
            <div className="flex items-center px-3.5 py-2 text-gray-400 group hover:ring-1 hover:ring-white/30 focus-within:!ring-2 ring-inset focus-within:!ring-white rounded-md bg-white/10">
                <Calendar className="mr-2 h-5 w-5 stroke-white/70" />
                <input
                    type="text"
                    readOnly
                    value={datepickerValue}
                    onClick={() => setShowDatepicker(!showDatepicker)}
                    className="block w-full appearance-none bg-transparent text-base text-white placeholder:text-white/50 focus:outline-none sm:text-sm sm:leading-6"
                    placeholder="Select date"
                />
            </div>

            {showDatepicker && (
                <div
                    className="bg-white mt-12 rounded-lg shadow p-4 absolute top-0 left-0 z-10"
                    style={{ width: '17rem' }}
                    onBlur={() => setShowDatepicker(false)}
                >
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <span className="text-lg font-bold text-gray-800">{MONTH_NAMES[month]}</span>
                            <span className="ml-1 text-lg text-gray-600 font-normal">{year}</span>
                        </div>
                        <div>
                            <button
                                type="button"
                                className={`transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full ${month === 0 ? 'cursor-not-allowed opacity-25' : ''}`}
                                onClick={changePrevMonth}
                                disabled={month === 0}
                            >
                                <svg className="h-6 w-6 text-gray-500 inline-flex" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                                </svg>
                            </button>
                            <button
                                type="button"
                                className={`transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full ${month === 11 ? 'cursor-not-allowed opacity-25' : ''}`}
                                onClick={changeNextMonth}
                                disabled={month === 11}
                            >
                                <svg className="h-6 w-6 text-gray-500 inline-flex" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap mb-3 -mx-1">
                        {DAYS.map((day, index) => (
                            <div key={index} style={{ width: '14.26%' }} className="px-1">
                                <div className="text-gray-800 font-medium text-center text-xs">{day}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap -mx-1">
                        {blankDays.map((_, index) => (
                            <div
                                key={index}
                                style={{ width: '14.28%' }}
                                className="text-center border p-1 border-transparent text-sm"
                            ></div>
                        ))}
                        {noOfDays.map((date, index) => (
                            <div key={index} style={{ width: '14.28%' }} className="px-1 mb-1">
                                <div
                                    onClick={() => getDateValue(date)}
                                    className={`cursor-pointer text-center text-sm leading-none rounded-full leading-loose transition ease-in-out duration-100 ${
                                        isToday(date)
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-700 hover:bg-blue-200'
                                    }`}
                                >
                                    {date}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;