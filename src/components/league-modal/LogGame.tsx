import React, { useState } from "react";
import { Button } from "../Button";

export default function LogGame({ leagueId }: { leagueId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Button gray onClick={() => setIsOpen(true)}>
      Log Game
    </Button>
  );
}
