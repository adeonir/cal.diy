import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button } from "@calcom/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@calcom/ui/components/popover";
import { Tooltip } from "@calcom/ui/components/tooltip";
import qrcode from "qrcode";
import { useEffect, useState } from "react";

const QR_CODE_SIZE = 256;

export function EventTypeQrCode({ url }: { url: string }) {
  const { t } = useLocale();
  const [dataUri, setDataUri] = useState<string>();

  useEffect(() => {
    let stale = false;

    qrcode
      .toDataURL(url, { width: QR_CODE_SIZE, margin: 1 })
      .then((uri) => {
        if (!stale) {
          setDataUri(uri);
        }
      })
      .catch(() => {
        if (!stale) {
          setDataUri(undefined);
        }
      });

    return () => {
      stale = true;
    };
  }, [url]);

  return (
    <Popover>
      <Tooltip content={t("show_qr_code")}>
        <PopoverTrigger asChild>
          <Button
            color="secondary"
            variant="icon"
            StartIcon="qr-code"
            data-testid="event-type-qr-code-button"
          />
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent className="w-auto p-3">
        {dataUri ? (
          <img alt={url} height={QR_CODE_SIZE} src={dataUri} width={QR_CODE_SIZE} />
        ) : (
          <div className="size-64 animate-pulse rounded-md bg-subtle" />
        )}
      </PopoverContent>
    </Popover>
  );
}
