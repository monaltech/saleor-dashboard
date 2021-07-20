import { TableCell } from "@material-ui/core";
import TableCellHeader, {
  TableCellHeaderProps
} from "@saleor/components/TableCellHeader";
import TableHead from "@saleor/components/TableHead";
import Label, {
  LabelSizes
} from "@saleor/orders/components/OrderHistory/Label";
import React, { useContext } from "react";
import { MessageDescriptor, useIntl } from "react-intl";

import { GiftCardsListContext } from "../GiftCardsListProvider";
import { giftCardsListTableMessages as messages } from "../messages";
import { useTableStyles as useStyles } from "../styles";
import { GiftCardsListTableCommonProps } from "../types";

interface HeaderItem {
  title?: MessageDescriptor;
  options?: TableCellHeaderProps;
}

const GiftCardsListTableHeader: React.FC<GiftCardsListTableCommonProps> = ({
  numberOfColumns,
  disabled
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const { toggleAll, listElements, giftCards } = useContext(
    GiftCardsListContext
  );

  const headerItems: HeaderItem[] = [
    {
      title: messages.giftCardsTableColumnGiftCardTitle,
      options: {
        className: classes.colCardCode,
        textAlign: "left"
      }
    },
    {
      title: messages.giftCardsTableColumnTagTitle
    },
    {
      title: messages.giftCardsTableColumnProductTitle
    },
    {
      title: messages.giftCardsTableColumnCustomerTitle
    },
    {
      title: messages.giftCardsTableColumnBalanceTitle,
      options: {
        className: classes.colBalance,
        textAlign: "right"
      }
    }
  ];
  return (
    <>
      <colgroup>
        <col />
        <col className={classes.colCardCode} />
        <col />
        <col />
        <col />
        <col className={classes.colBalance} />
        <col className={classes.colDelete} />
      </colgroup>
      <TableHead
        colSpan={numberOfColumns}
        selected={listElements.length}
        disabled={disabled}
        items={giftCards}
        toggleAll={toggleAll}
      >
        {headerItems.map(({ title, options }) => (
          <TableCellHeader {...options}>
            <Label text={intl.formatMessage(title)} size={LabelSizes.md} />
          </TableCellHeader>
        ))}
        <TableCell className={classes.colDelete} />
      </TableHead>
    </>
  );
};

export default GiftCardsListTableHeader;
