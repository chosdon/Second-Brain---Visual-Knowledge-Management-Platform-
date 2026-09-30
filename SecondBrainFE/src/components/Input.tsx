import React from 'react';

export const Input = React.forwardRef<
  HTMLInputElement,
  {
    placeholder: string;
    type?: string;
    className?: string;
  }
>((props, ref) => {
  return (
    <div>
      <input
        ref={ref}
        type={props.type || 'text'}
        placeholder={props.placeholder}
        className={
          props.className ||
          'px-4 py-2 rounded-lg border border-slate-300 m-2 w-full'
        }
      />
    </div>
  );
});
