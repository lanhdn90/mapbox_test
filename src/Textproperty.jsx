import React, { useEffect } from "react";

export default function Textproperty() {
  useEffect(() => {
    console.log(
      "Log: ~ file: Textproperty.jsx ~ line 10 ~ return ~ second",
    );
  }, []);

  return <div>Textproperty</div>;
}
