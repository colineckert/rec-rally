import React, { useState } from "react";
import { Button } from "../Button";

export default function LogGame({ leagueId }: { leagueId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button gray onClick={() => setIsOpen(true)}>
        Log Game
      </Button>
      <LogGameModal
        leagueId={leagueId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

function LogGameModal({
  leagueId,
  isOpen,
  onClose,
}: {
  leagueId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  return null;
}
