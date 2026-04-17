import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const Input = React.memo(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  icon: Icon,
  showPasswordToggle = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { conditionalClasses } = useThemeClasses();

  const inputType = showPasswordToggle && showPassword ? 'text' : type;

  const baseClasses = 'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#662d91] focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';
  const iconClasses = Icon ? 'pl-12' : '';

  // Clases condicionales para el input
  const inputBgColor = conditionalClasses({ light: 'bg-white border-gray-300', dark: 'bg-gray-700 border-gray-600' });
  const textColor = conditionalClasses({ light: 'text-gray-900', dark: 'text-gray-100' });
  const placeholderColor = conditionalClasses({ light: 'text-gray-500', dark: 'text-gray-400' });

  const classes = [baseClasses, inputBgColor, errorClasses, iconClasses, className].filter(Boolean).join(' ');

  // Clases para label
  const labelClasses = conditionalClasses({
    light: 'block text-sm font-semibold text-gray-700',
    dark: 'block text-sm font-semibold text-gray-300'
  });

  // Clases para ícono del input
  const iconStyle = conditionalClasses({ light: 'h-5 w-5 text-gray-400', dark: 'h-5 w-5 text-gray-400' });

  // Clases para botón toggle password
  const toggleBtnClasses = conditionalClasses({
    light: 'absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600',
    dark: 'absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300'
  });

  // Clases para mensaje de error
  const errorMsgClasses = conditionalClasses({ light: 'text-sm text-red-600', dark: 'text-sm text-red-400' });

  return (
    <div className="space-y-1">
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className={iconStyle} />
          </div>
        )}

        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${classes} ${textColor} ${placeholderColor}`.trim()}
          {...props}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={toggleBtnClasses}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
          </button>
        )}
      </div>

      {error && (
        <p className={errorMsgClasses}>{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

