"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function TestSelect() {
  const [value, setValue] = useState("");

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-xl font-bold">Test Select Component</h1>

      <div className="flex flex-col space-y-2">
        <label>Standard Select</label>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <p>Selected value: {value || "none"}</p>
        <Button onClick={() => setValue("")}>Reset</Button>
      </div>
    </div>
  );
}
