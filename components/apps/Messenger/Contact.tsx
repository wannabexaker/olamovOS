import { memo, useEffect, useMemo, useRef, useState } from "react";
import { type Event } from "nostr-tools";
import Profile from "components/apps/Messenger/Profile";
import {
  OLAMOV_OWNER_AVATAR,
  OLAMOV_OWNER_NAME,
} from "components/apps/Messenger/constants";
import {
  copyKeyMenuItems,
  decryptMessage,
  shortTimeStamp,
} from "components/apps/Messenger/functions";
import { useNostrProfile } from "components/apps/Messenger/hooks";
import { useMenu } from "contexts/menu";
import Button from "styles/common/Button";
import { MENU_SEPERATOR, MILLISECONDS_IN_MINUTE } from "utils/constants";
import { useIsVisible } from "hooks/useIsVisible";

type ContactProps = {
  isRequest?: boolean;
  lastEvent: Event;
  onAccept?: () => void;
  onBlock?: () => void;
  onClick: () => void;
  pinned?: boolean;
  pubkey: string;
  publicKey: string;
  unreadEvent: boolean;
};

const Contact: FC<ContactProps> = ({
  isRequest,
  lastEvent,
  onAccept,
  onBlock,
  onClick,
  pinned,
  pubkey,
  publicKey,
  unreadEvent,
}) => {
  const {
    content = "",
    created_at = 0,
    id,
    pubkey: eventPubkey,
  } = lastEvent || {};
  const [decryptedContent, setDecryptedContent] = useState("");
  const [timeStamp, setTimeStamp] = useState("");
  const elementRef = useRef<HTMLLIElement | null>(null);
  const isVisible = useIsVisible(elementRef);
  const { nip05, picture, userName } = useNostrProfile(pubkey, isVisible);
  const unreadClass = unreadEvent ? "unread" : undefined;
  const { contextMenu } = useMenu();
  const { onContextMenuCapture } = useMemo(
    () =>
      contextMenu?.(() => [
        {
          action: onClick,
          icon: "🔐",
          label: "Start end-to-end encrypted chat",
        },
        MENU_SEPERATOR,
        ...copyKeyMenuItems(pubkey),
      ]),
    [contextMenu, onClick, pubkey]
  );

  useEffect(() => {
    if (content && isVisible) {
      decryptMessage(id, content, pubkey).then(
        (message) => message && setDecryptedContent(message)
      );
    }
  }, [content, id, isVisible, pubkey]);

  useEffect(() => {
    let interval = 0;

    if (created_at) {
      setTimeStamp(shortTimeStamp(created_at));

      interval = window.setInterval(
        () => setTimeStamp(shortTimeStamp(created_at)),
        MILLISECONDS_IN_MINUTE
      );
    }

    return () => window.clearInterval(interval);
  }, [created_at]);

  return (
    <li
      ref={elementRef}
      className={unreadClass}
      data-pinned={pinned ? "owner" : undefined}
      onContextMenuCapture={onContextMenuCapture}
    >
      <Button onClick={onClick}>
        <Profile
          nip05={nip05}
          picture={pinned ? OLAMOV_OWNER_AVATAR : picture}
          pubkey={pubkey}
          userName={pinned ? userName || OLAMOV_OWNER_NAME : userName}
        >
          <div>
            <div className={unreadClass}>
              {eventPubkey === publicKey ? "You: " : ""}
              {decryptedContent || content}
            </div>
            {timeStamp ? "·" : ""}
            <div>{timeStamp}</div>
          </div>
        </Profile>
      </Button>
      {isRequest && (
        <div className="request-actions">
          <Button onClick={onAccept}>Accept</Button>
          <Button onClick={onBlock}>Block</Button>
        </div>
      )}
    </li>
  );
};

export default memo(Contact);
