# Document Import UI

This document describes the frontend behavior for reviewing transaction
candidates extracted from uploaded PDFs.

Backend companion docs:

```text
../Financist.Api/docs/pdf-transaction-import.md
../Financist.Api/docs/document-transaction-api-contracts.md
```

## Main Files

- `src/app/features/documents/documents.service.ts`
- `src/app/features/documents/pages/documents-page.component.ts`
- `src/app/features/documents/pages/documents-page.component.html`
- `src/app/features/documents/pages/documents-page.component.scss`
- `src/app/shared/models/document-import.model.ts`
- `src/app/features/transactions/transactions.service.ts`

## User Flow

1. User uploads one or more PDFs in the documents page.
2. The uploaded document is selected automatically.
3. The UI calls:

```text
GET /documents/{documentImportId}/transaction-candidates
```

4. Candidate rows appear in the review table.
5. For each `PendingReview` row, the user can:

- edit the candidate fields
- import the candidate as a transaction
- reject the candidate

6. After import, the UI refreshes transaction state through
   `TransactionsService.refresh()`.
7. Imported and rejected rows remain visible as reviewed history.

## Editable Fields

The import action sends the reviewed values, not blindly the extracted values:

- `description`
- `amount`
- `currency`
- `type`
- `occurredOn`

The backend applies these values to the candidate before creating the
transaction.

## Candidate Status UI

Supported statuses:

- `PendingReview`: show edit, import, and reject actions.
- `Imported`: show reviewed state and transaction id when available.
- `Rejected`: show reviewed state, no transaction.

Only pending rows should expose mutating actions.

## Installment Display

If both `installmentNumber` and `installmentCount` exist, show them as:

```text
3/10
```

Otherwise show the candidate as a single payment.

`installmentGroupKey` is intentionally shown in shortened form. It helps debug
whether separate monthly installments were grouped as the same purchase while
still keeping each installment as a different candidate.

## Mock Mode

`DocumentsService` includes mock candidates when `environment.useMockData` is
enabled. Keep the mock data aligned with the real API shape so the page remains
usable without the backend.

## Manual Test Checklist

- Upload PDF.
- Confirm selected document loads candidates.
- Confirm a pending row can enter edit mode.
- Change amount, date, type, or description.
- Import from edit mode.
- Confirm the row becomes `Imported`.
- Confirm the transactions state refreshes.
- Reject another pending row.
- Confirm the row becomes `Rejected`.
- Confirm imported/rejected rows no longer expose import/reject actions.
