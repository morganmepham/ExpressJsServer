const TextField = ({ placeholder, value, setValue }) => {
  return (
    <div className="text-base w-full h-20">
      <input
        type="text"
        className="rounded-md pl-1 pr-1 h-8 w-full"
        placeholder={placeholder ? placeholder : ""}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default TextField;
