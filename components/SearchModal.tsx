"use client";

export default function SearchModal({
  open,
  close,
}:{
  open:boolean;
  close:()=>void;
}) {
  if(!open) return null;

  return (
    <div className="overlay" onClick={close}>
      <div className="box" onClick={(e)=>e.stopPropagation()}>
        <input placeholder="Search chats..." />
      </div>
    </div>
  );
}
