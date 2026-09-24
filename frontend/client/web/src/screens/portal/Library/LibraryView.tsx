"use client";

import React, { useState, type ReactNode } from "react";
import { ScreenHeader } from "@foundation/product-components/screens/web/ScreenHeader";
import { AssetPicker, type AssetPickerValue } from "@foundation/ui/web/AssetPicker";
import { Background } from "@foundation/ui/web/Background";
import { Badge } from "@foundation/ui/web/Badge";
import { Button } from "@foundation/ui/web/Button";
import { Card } from "@foundation/ui/web/Card";
import { CurrencyInput } from "@foundation/ui/web/CurrencyInput";
import { DataField } from "@foundation/ui/web/DataField";
import { Divider } from "@foundation/ui/web/Divider";
import { DropdownPicker } from "@foundation/ui/web/DropdownPicker";
import { EmptyState } from "@foundation/ui/web/EmptyState";
import { Field } from "@foundation/ui/web/Field";
import { FieldGrid, FieldGridItem } from "@foundation/ui/web/FieldGrid";
import { FormattedInput } from "@foundation/ui/web/FormattedInput";
import { Icon } from "@foundation/ui/web/Icon";
import { SearchIcon } from "@foundation/ui/web/Icon/AppIcons";
import { Input } from "@foundation/ui/web/Input";
import { Container, Grid, GridItem, Inline, Stack } from "@foundation/ui/web/Layout";
import { Modal } from "@foundation/ui/web/Modal";
import { MultiSelect } from "@foundation/ui/web/MultiSelect";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import { SegmentedControl } from "@foundation/ui/web/SegmentedControl";
import { Select } from "@foundation/ui/web/Select";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import { Surface } from "@foundation/ui/web/Surface";
import { Text } from "@foundation/ui/web/Text";
import { TextArea } from "@foundation/ui/web/TextArea";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import { OrderSummaryItem, ProductItemCard, ProductItemCardSkeleton } from "@royalprime/product-components/ecommerce";
import styles from "./LibraryView.module.css";

const appearances = ["solid", "soft", "outline", "transparent", "glass"] as const;
const buttonSizes = ["sm", "md", "lg"] as const;
const cardSizes = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;

interface LibraryCategoryProps {
  children: ReactNode;
}

const LibraryCategory: React.FC<LibraryCategoryProps> = ({ children }) => (
  <section className={styles.category}>{children}</section>
);

const LibraryItem: React.FC<{ children: ReactNode; description: string; title: string }> = ({ children, title }) => (
  <section className={styles.item}>
    <Text as="h3" variant="h3">{title}</Text>
    {children}
    <Divider />
  </section>
);

export const LibraryView: React.FC = () => {
  const strings = useClientStrings().library;
  const options = [{ label: strings.options.one, value: "one" }, { label: strings.options.two, value: "two" }, { label: strings.options.three, value: "three" }];
  const [selectValue, setSelectValue] = useState("one");
  const [pickerValue, setPickerValue] = useState("one");
  const [multiValue, setMultiValue] = useState(["one"]);
  const [segmentValue, setSegmentValue] = useState("one");
  const [modalOpen, setModalOpen] = useState(false);
  const [assetValue, setAssetValue] = useState<AssetPickerValue>(null);
  const [productQuantity, setProductQuantity] = useState(0);
  const [productFavorite, setProductFavorite] = useState(false);

  return (
    <main className={styles.root}>
      <Background background={{ pattern: "glass" }} />
      <ScreenHeader description={strings.page.description} mobileGutter="none" mobileMode="collapsible" mobileTitle={strings.page.mobileTitle} title={strings.page.title} />
      <Container className={styles.main} gutter="page" width="wide">
        <Stack gap="3xl">
          <LibraryCategory>
            <LibraryItem description={strings.surface.description} title={strings.surface.title}>
              <Grid columns="theme" gap="md">{appearances.map((appearance) => <GridItem key={appearance} span={4}><Surface appearance={appearance} className={styles.surfaceSample} tone="accent"><Text tone="inherit" weight="semibold">{strings.surface.appearances[appearance]}</Text><Text tone="inherit">{strings.surface.sampleDescription}</Text></Surface></GridItem>)}</Grid>
            </LibraryItem>
            <LibraryItem description={strings.cards.description} title={strings.cards.title}>
              <Grid columns="theme" gap="md">{cardSizes.map((size) => <GridItem key={size} span={3}><Stack gap="xs"><Text tone="muted" variant="caption">{size}</Text><Card size={size}><Skeleton shape="text" size="xs" width="full" /></Card></Stack></GridItem>)}<GridItem span={3}><Stack gap="xs"><Text tone="muted" variant="caption">{strings.skeleton.title}</Text><Card skeletonWidth="full" state="skeleton" /></Stack></GridItem></Grid>
            </LibraryItem>
          </LibraryCategory>

          <LibraryCategory>
            <LibraryItem description={strings.button.description} title={strings.button.title}><Grid columns="theme" gap="md">{appearances.map((appearance) => <GridItem key={appearance} span={4}><Card className={styles.sampleCard}><Text tone="muted">{strings.button.appearances[appearance]}</Text><Button appearance={appearance} tone="accent">{strings.button.actionLabel}</Button></Card></GridItem>)}</Grid><Inline className={styles.inlineSamples} gap="md" wrap>{buttonSizes.map((size) => <Button key={size} size={size} tone="accent">{strings.button.sizes[size]}</Button>)}<Button disabled tone="accent">{strings.button.states.disabled}</Button><Button loading tone="accent">{strings.button.states.loading}</Button><Button size="md" state="skeleton" /></Inline></LibraryItem>
            <LibraryItem description={strings.forms.description} title={strings.forms.title}><FieldGrid columns={3} responsiveColumns={{ mobile: 1, tablet: 2 }}><FieldGridItem><Input label={strings.input.default.label} placeholder={strings.input.default.placeholder} /></FieldGridItem><FieldGridItem><Input icon={<SearchIcon />} label={strings.input.icon.label} placeholder={strings.input.icon.placeholder} /></FieldGridItem><FieldGridItem><Input error={strings.input.error.message} label={strings.input.error.label} placeholder={strings.input.error.placeholder} /></FieldGridItem><FieldGridItem><Input disabled label={strings.input.disabled.label} placeholder={strings.input.disabled.placeholder} /></FieldGridItem><FieldGridItem><Input label={strings.input.default.label} state="skeleton" /></FieldGridItem><FieldGridItem><TextArea disabled label={strings.forms.textArea.label} placeholder={strings.forms.textArea.placeholder} /></FieldGridItem><FieldGridItem><CurrencyInput defaultValue={12990} label={strings.forms.currency.label} /></FieldGridItem><FieldGridItem><FormattedInput format="decimalBR" label={strings.forms.formatted.label} onValueChange={() => undefined} value="12,5" /></FieldGridItem><FieldGridItem><Field description={strings.forms.field.description} label={strings.forms.field.label}><Input placeholder={strings.forms.field.placeholder} /></Field></FieldGridItem><FieldGridItem><Select aria-label={strings.forms.select.label} onChange={(event) => setSelectValue(event.target.value)} options={options} value={selectValue} /></FieldGridItem><FieldGridItem><Select aria-label={strings.forms.select.label} disabled options={options} value={selectValue} /></FieldGridItem><FieldGridItem><DropdownPicker ariaLabel={strings.forms.dropdown.label} label={strings.forms.dropdown.label} onChange={setPickerValue} options={options} searchable searchPlaceholder={strings.forms.dropdown.placeholder} value={pickerValue} /></FieldGridItem><FieldGridItem><DropdownPicker ariaLabel={strings.forms.dropdown.label} disabled label={strings.forms.dropdown.label} options={options} value={pickerValue} /></FieldGridItem><FieldGridItem><DropdownPicker label={strings.forms.dropdown.label} state="skeleton" /></FieldGridItem><FieldGridItem span="full"><MultiSelect cancelRemoveLabel={strings.multiSelect.cancel} confirmRemoveDescription={(label) => strings.multiSelect.confirmDescription.replace("{label}", label)} confirmRemoveLabel={strings.multiSelect.confirm} confirmRemoveTitle={strings.multiSelect.confirmTitle} emptyOptionLabel={strings.multiSelect.placeholder} onChange={setMultiValue} options={options} removeLabel={(label) => strings.multiSelect.remove.replace("{label}", label)} removeModalCloseLabel={strings.modal.close} searchable searchPlaceholder={strings.multiSelect.searchPlaceholder} value={multiValue} /></FieldGridItem></FieldGrid></LibraryItem>
            <LibraryItem description={strings.asset.description} title={strings.asset.title}><AssetPicker accept="image/*" cancelRemoveLabel={strings.asset.cancel} chooseFileLabel={strings.asset.choose} confirmRemoveDescription={strings.asset.confirmDescription} confirmRemoveLabel={strings.asset.confirm} confirmRemoveTitle={strings.asset.confirmTitle} dropzoneLabel={strings.asset.dropzone} onChange={setAssetValue} previewAlt={strings.asset.previewAlt} removeLabel={strings.asset.remove} removeModalCloseLabel={strings.modal.close} urlPlaceholder={strings.asset.urlPlaceholder} value={assetValue} /></LibraryItem>
          </LibraryCategory>

          <LibraryCategory>
            <LibraryItem description={strings.feedback.description} title={strings.feedback.title}><Grid columns="theme" gap="md">{appearances.map((appearance) => <GridItem key={appearance} span={4}><Card className={styles.sampleCard}><Text tone="muted">{strings.button.appearances[appearance]}</Text><Badge appearance={appearance} indicator tone="success">{strings.feedback.success}</Badge></Card></GridItem>)}</Grid><Inline gap="sm" wrap><Badge appearance="soft" indicator tone="success">{strings.feedback.success}</Badge><Badge appearance="soft" indicator tone="warning">{strings.feedback.warning}</Badge><Badge appearance="soft" indicator tone="danger">{strings.feedback.danger}</Badge><Icon tone="accent"><SearchIcon /></Icon></Inline><DataField description={strings.feedback.data.description} label={strings.feedback.data.label} value={strings.feedback.data.value} /><Divider /><EmptyState actions={<Button appearance="outline" tone="neutral">{strings.feedback.empty.action}</Button>} description={strings.feedback.empty.description} framed icon={<Icon tone="accent"><SearchIcon /></Icon>} title={strings.feedback.empty.title} /></LibraryItem>
            <LibraryItem description={strings.modal.description} title={strings.modal.title}><Button onClick={() => setModalOpen(true)} tone="accent">{strings.modal.open}</Button><Modal closeLabel={strings.modal.close} description={strings.modal.dialogDescription} onClose={() => setModalOpen(false)} open={modalOpen} title={strings.modal.dialogTitle}><Stack gap="md"><Text>{strings.modal.dialogBody}</Text><Button onClick={() => setModalOpen(false)} tone="accent">{strings.modal.close}</Button></Stack></Modal></LibraryItem>
          </LibraryCategory>

          <LibraryCategory><LibraryItem description={strings.composition.description} title={strings.composition.title}><SegmentedControl items={options.map((item) => ({ key: item.value, label: item.label }))} onChange={setSegmentValue} value={segmentValue} /><SectionContainer atmosphere="glass" usefulColumns={14}><Text as="p">{strings.composition.sectionContainer}</Text></SectionContainer></LibraryItem></LibraryCategory>

          <LibraryCategory><LibraryItem description={strings.cards.product.description} title={strings.cards.product.title}><Grid columns="theme" gap="md"><GridItem span={6}><ProductItemCard actionLabel={strings.cards.product.action} actionMode="quantity" categoryLabel={strings.cards.product.category} decreaseQuantityAriaLabel={strings.cards.product.decreaseQuantity} description={strings.cards.product.description} detailLabel={strings.cards.product.detail} favorite={productFavorite} favoriteAriaLabel={strings.cards.product.favorite} formatPrice={(value) => strings.cards.product.price.replace("{value}", String(value))} image="" increaseQuantityAriaLabel={strings.cards.product.increaseQuantity} name={strings.cards.product.name} onAction={() => setProductQuantity((quantity) => quantity + 1)} onDecrease={() => setProductQuantity((quantity) => Math.max(quantity - 1, 0))} onFavoriteToggle={() => setProductFavorite((favorite) => !favorite)} preset="catalogo" price={42} priceLabel={strings.cards.product.priceLabel} quantity={productQuantity} quantityMode="stepper" removeFavoriteAriaLabel={strings.cards.product.removeFavorite} selected={productQuantity > 0} selectedActionLabel={strings.cards.product.selectedAction} showAction /></GridItem><GridItem span={6}><ProductItemCardSkeleton preset="catalogo" /></GridItem></Grid><Grid columns="theme" gap="md"><GridItem span={6}><Card className={styles.orderSummaryCard}><Stack gap="xs"><Text as="h4" variant="h3">{strings.cards.order.title}</Text><Text tone="muted">{strings.cards.order.description}</Text></Stack><OrderSummaryItem detail={strings.cards.order.itemDetail} name={strings.cards.order.itemName} priceLabel={strings.cards.order.itemPrice} secondaryAction={{ label: strings.cards.order.action, onClick: () => undefined }} /></Card></GridItem></Grid></LibraryItem></LibraryCategory>
        </Stack>
      </Container>
    </main>
  );
};
