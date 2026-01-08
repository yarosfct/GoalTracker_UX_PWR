import React, { useState, useEffect } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  required,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse initial value (HH:MM 24h) to internal state
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hour: 12, minute: 0, period: 'AM' as const };
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return { hour, minute: m, period: period as 'AM' | 'PM' };
  };

  const [selectedTime, setSelectedTime] = useState(parseTime(value));

  useEffect(() => {
    setSelectedTime(parseTime(value));
  }, [value]);

  const updateTime = (updates: Partial<typeof selectedTime>) => {
    const newTime = { ...selectedTime, ...updates };
    setSelectedTime(newTime);
    
    // Convert back to 24h string for parent
    let h = newTime.hour;
    if (newTime.period === 'PM' && h !== 12) h += 12;
    if (newTime.period === 'AM' && h === 12) h = 0;
    
    const timeString = `${h.toString().padStart(2, '0')}:${newTime.minute.toString().padStart(2, '0')}`;
    onChange(timeString);
  };

  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);


  const displayValue = value 
    ? `${selectedTime.hour.toString().padStart(2, '0')}:${selectedTime.minute.toString().padStart(2, '0')} ${selectedTime.period}`
    : '--:-- --';

  return (
    <div className={`relative ${className}`} ref={ref}>
      {label && (
        <label className="block text-gray-700 mb-2">
          {label} {required && '*'}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 border rounded-lg flex items-center justify-between bg-white transition-all ${
          isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className={!value ? 'text-gray-400' : ''}>{displayValue}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-full sm:w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
          <div className="flex gap-2 h-48">
            {/* Hours */}
            <div className="flex-1 flex flex-col">
              <span className="text-xs text-center text-gray-400 mb-2 font-medium">Hour</span>
              <div className="flex-1 overflow-y-auto scrollbar-hide snap-y snap-mandatory rounded-lg bg-gray-50 border border-gray-100">
                {hours.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => updateTime({ hour: h })}
                    className={`w-full py-2 text-sm snap-center transition-colors ${
                      selectedTime.hour === h
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {h.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="flex items-center justify-center text-gray-300 font-bold">:</div>

            {/* Minutes */}
            <div className="flex-1 flex flex-col">
              <span className="text-xs text-center text-gray-400 mb-2 font-medium">Minute</span>
              <div className="flex-1 overflow-y-auto scrollbar-hide snap-y snap-mandatory rounded-lg bg-gray-50 border border-gray-100">
                {minutes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => updateTime({ minute: m })}
                    className={`w-full py-2 text-sm snap-center transition-colors ${
                      selectedTime.minute === m
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {m.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* Period */}
            <div className="flex-1 flex flex-col ml-2">
              <span className="text-xs text-center text-gray-400 mb-2 font-medium">AM/PM</span>
              <div className="flex-1 flex flex-col gap-1">
                {['AM', 'PM'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => updateTime({ period: p as 'AM' | 'PM' })}
                    className={`flex-1 rounded-lg text-sm font-medium transition-colors border ${
                      selectedTime.period === p
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




