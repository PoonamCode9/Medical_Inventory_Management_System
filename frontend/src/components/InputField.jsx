import React from "react";


function InputField({
    name,
    label,
    icon,
    type="text",
    value,
    onChange,
    required=false,
    min,
    step,
    placeholder
}) {


    return (

        <div>

            <label
                className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                "
            >

                <span className="
                    inline-flex
                    items-center
                    gap-2
                ">

                    <span className="text-blue-600">
                        {icon}
                    </span>

                    {label}

                    {
                        required &&
                        <span className="text-red-500">
                            *
                        </span>
                    }

                </span>


            </label>



            <input

                name={name}

                type={type}

                value={value}

                onChange={onChange}

                required={required}

                min={min}

                step={step}

                placeholder={placeholder}


                className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    text-slate-800
                    placeholder:text-slate-400
                    outline-none
                    transition

                    focus:bg-white
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100

                    hover:border-slate-300
                "

            />


        </div>

    );

}


export default React.memo(InputField);