const MethodRadio = ({ selected, onClick, label }) => (
  <div className="flex items-center mr-4 cursor-pointer" onClick={onClick}>
    <div className="w-5 h-5 border border-[#f63b60] rounded-full flex justify-center items-center mr-1">
      {selected && <div className="w-3 h-3 rounded-full bg-[#f63b60]" />}
    </div>
    <p className="text-[#444] font-semibold">{label}</p>
  </div>
);

export default MethodRadio;
