 # Promocode Frontend Integration

Bu hujjat frontend uchun promo code flow bo'yicha to'liq qo'llanma. Barcha endpointlar JWT token bilan ishlaydi, public client promo tekshirish ham user token talab qiladi.

## Base Rules

Base path:

```txt
{{baseUrl}}/promocode
```

Auth header:

```http
Authorization: Bearer <token>
```

Amount format:

- Request body'da admin setting uchun `500` yuborilsa, bu 500 so'm/kzt kabi major unit.
- Response'da ham amountlar major unitda qaytadi.
- Backend ichkarida minor unitga o'giradi, frontend buni o'ylamaydi.

## Enums

### UserRoles

```ts
type UserRoles =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'ACCOUNTANT'
  | 'PRE_ACCOUNTANT'
  | 'AGENT';
```

Promo admin endpointlar:

```ts
['SUPER_ADMIN', 'ADMIN']
```

Agent kabinet endpointlari:

```ts
['AGENT']
```

### Status

```ts
type Status = 'ACTIVE' | 'INACTIVE';
```

Ishlatilishi:

- `ACTIVE`: promo ishlaydi.
- `INACTIVE`: promo yaratib qo'yilgan, lekin client foydalana olmaydi.

### PromoCodeCreationMode

```ts
type PromoCodeCreationMode = 'AUTO' | 'MANUAL' | 'BOTH';
```

Admin global settingda ishlatiladi:

- `AUTO`: agent faqat auto generate qila oladi.
- `MANUAL`: agent faqat qo'lda code yozib yarata oladi.
- `BOTH`: agent auto yoki manual tanlay oladi.

### Agent Create Creation Mode

Agent promo yaratganda request body'da faqat ikkita qiymat yuboriladi:

```ts
type PromoCodeRequestCreationMode = 'AUTO' | 'MANUAL';
```

- `AUTO`: frontend `code` yubormaydi, backend code generatsiya qiladi.
- `MANUAL`: frontend `code` yuborishi shart.

### PromoLimitType

```ts
type PromoLimitType = 'ONCE' | 'UNLIMITED' | 'CUSTOM';
```

- `ONCE`: promo faqat 1 marta ishlatiladi. Backend `usage_limit = 1` qiladi.
- `UNLIMITED`: cheksiz. Backend `usage_limit = null` qiladi.
- `CUSTOM`: frontend `usage_limit` yuboradi.

### PromoUsageStatus

```ts
type PromoUsageStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED';
```

- `PENDING`: payment yaratildi, hali to'lov confirmed emas.
- `CONFIRMED`: to'lov muvaffaqiyatli, promo real ishlatilgan.
- `CANCELED`: payment fail/cancel bo'lgan yoki promo usage bekor qilingan.

Reportlarda default status:

```ts
'CONFIRMED'
```

### TransactionStatus

```ts
type TransactionStatus =
  | 'PENDING'
  | 'SUCCESS'
  | 'WAITING_ORDER_CONFIRMATION'
  | 'FAILED'
  | 'CANCELED'
  | 'REFUNDED'
  | 'ERROR'
  | 'UNKNOWN';
```

Admin report filterida ishlatiladi.

## Client Promo Flow

Client checkoutda promo code ishlatish uchun ikkita qadam bor.

### 1. Validate Promo

```http
POST /promocode/validate
Authorization: Bearer <user_token>
Content-Type: application/json
```

Body:

```json
{
  "code": "LAZIZ2525"
}
```

Success response:

```json
{
  "success": true,
  "message": "Промокод применим!",
  "data": {
    "code": "LAZIZ2525",
    "discount_amount": 500,
    "agent_credit_amount": 700,
    "total_amount": 2500,
    "final_amount": 2000
  }
}
```

Frontend:

- `discount_amount`ni cart summaryda "Скидка" sifatida chiqaring.
- `final_amount`ni paymentga ketadigan final summa sifatida ko'rsating.
- Agar error qaytsa, promo input ostida backend `message`ni chiqaring.

### 2. Prepare Payment With Promo

```http
POST /payment/prepare-payment
Authorization: Bearer <user_token>
Content-Type: application/json
```

Body promo bilan:

```json
{
  "promo_code": "LAZIZ2525"
}
```

Body promosiz:

```json
{}
```

Success response:

```json
{
  "success": true,
  "message": "",
  "data": {
    "payment_url": "https://..."
  }
}
```

Important:

- Promo usage faqat payment confirmed bo'lgandan keyin `CONFIRMED` bo'ladi.
- Payment fail bo'lsa usage `CANCELED` qilinadi.

## Agent Cabinet

Agent token ichida role `AGENT` bo'lishi kerak.

### Get Global Settings For Agent

Agent promo yaratish formasi ochilganda shu endpointni chaqiring.

```http
GET /promocode/my/settings
Authorization: Bearer <agent_token>
```

Response:

```json
{
  "success": true,
  "data": {
    "client_discount_amount": 500,
    "agent_credit_amount": 700,
    "is_creation_enabled": true,
    "creation_mode": "BOTH",
    "allow_limit_once": true,
    "allow_limit_unlimited": true,
    "allow_limit_custom": true,
    "allow_no_expiry": true,
    "allow_expires_at": true
  }
}
```

Frontend form rules:

- Agar `is_creation_enabled = false`: create button disabled.
- Agar `creation_mode = AUTO`: manual radio disabled, `code` input hidden.
- Agar `creation_mode = MANUAL`: auto radio disabled, `code` input visible required.
- Agar `creation_mode = BOTH`: auto/manual radio ikkalasi active.
- `allow_limit_once = false`: `ONCE` option disabled.
- `allow_limit_unlimited = false`: `UNLIMITED` option disabled.
- `allow_limit_custom = false`: `CUSTOM` option disabled.
- `allow_no_expiry = false`: "Без срока" checkbox disabled.
- `allow_expires_at = false`: expiry date input disabled.

### Create Promo As Agent

```http
POST /promocode/my
Authorization: Bearer <agent_token>
Content-Type: application/json
```

Auto generate:

```json
{
  "creation_mode": "AUTO",
  "limit_type": "UNLIMITED"
}
```

Auto generate with expiry:

```json
{
  "creation_mode": "AUTO",
  "limit_type": "ONCE",
  "expires_at": "2026-12-31T23:59:59.000Z"
}
```

Manual:

```json
{
  "creation_mode": "MANUAL",
  "code": "LAZIZ2525",
  "limit_type": "CUSTOM",
  "usage_limit": 10,
  "expires_at": "2026-12-31T23:59:59.000Z"
}
```

Field rules:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `creation_mode` | `AUTO` or `MANUAL` | no | Default: `AUTO` if code yo'q, `MANUAL` if code bor |
| `code` | string | only manual | 4-32 belgi, lotin uppercase/number. Backend uppercase qiladi |
| `limit_type` | `ONCE`, `UNLIMITED`, `CUSTOM` | no | Default: `UNLIMITED` |
| `usage_limit` | number | only `CUSTOM` | min `1` |
| `expires_at` | ISO date string | no | Yuborilmasa muddatsiz |

Backend validation:

- `creation_mode = AUTO` va `code` yuborilsa `400`.
- `creation_mode = MANUAL` va `code` yo'q bo'lsa `400`.
- Global setting ruxsat bermagan option yuborilsa `403`.

Success response:

```json
{
  "success": true,
  "message": "Промокод создан!",
  "data": {
    "id": 1,
    "code": "K7MZQ4XA",
    "status": "ACTIVE",
    "creation_mode": "AUTO",
    "usage_limit": null,
    "used_count": 0,
    "expires_at": null,
    "client_discount_amount": 500,
    "agent_credit_amount": 700,
    "agent_id": 12,
    "created_by_staff_id": 12,
    "agent": {
      "id": 12,
      "name": "Agent name",
      "login": "agent_login",
      "role": "AGENT"
    },
    "_count": {
      "usages": 0
    }
  }
}
```

Auto generated code format:

```txt
8 ta belgi, masalan: K7MZQ4XA
Alphabet: ABCDEFGHJKLMNPQRSTUVWXYZ23456789
```

### Get Agent Promo List + Balance

```http
GET /promocode/my?page=1&size=20&status=ACTIVE&search=LAZIZ
Authorization: Bearer <agent_token>
```

Query:

| Key | Type | Required | Notes |
| --- | --- | --- | --- |
| `page` | number | no | default `1` |
| `size` | number | no | default `20` |
| `status` | `ACTIVE` or `INACTIVE` | no | promo status |
| `search` | string | no | code bo'yicha search |

Response:

```json
{
  "success": true,
  "data": {
    "balance": 7000,
    "items": [
      {
        "id": 1,
        "code": "LAZIZ2525",
        "status": "ACTIVE",
        "creation_mode": "MANUAL",
        "usage_limit": 10,
        "used_count": 3,
        "expires_at": "2026-12-31T23:59:59.000Z",
        "client_discount_amount": 500,
        "agent_credit_amount": 700,
        "_count": {
          "usages": 3
        }
      }
    ]
  },
  "meta": {
    "totalPage": 1,
    "totalSize": 20,
    "currentPage": 1,
    "hasNextPage": false,
    "hasPreviousPage": false,
    "totalItems": 1
  }
}
```

### Agent Statistics

```http
GET /promocode/my/statistics?date_from=2026-06-01&date_to=2026-06-30&promo_code=LAZIZ2525&status=CONFIRMED
Authorization: Bearer <agent_token>
```

Query:

| Key | Type | Required | Default |
| --- | --- | --- | --- |
| `date_from` | `YYYY-MM-DD` or ISO date | no | no limit |
| `date_to` | `YYYY-MM-DD` or ISO date | no | no limit |
| `promo_code` | string | no | all |
| `status` | `PENDING`, `CONFIRMED`, `CANCELED` | no | `CONFIRMED` |

Date filter field:

- `CONFIRMED`: `confirmed_at` bo'yicha filter.
- `CANCELED`: `canceled_at` bo'yicha filter.
- `PENDING`: `created_at` bo'yicha filter.

Response:

```json
{
  "success": true,
  "data": {
    "agent": {
      "id": 12,
      "name": "Agent name",
      "login": "agent_login",
      "role": "AGENT",
      "status": "ACTIVE"
    },
    "filters": {
      "date_from": "2026-06-01",
      "date_to": "2026-06-30",
      "promo_code": "LAZIZ2525",
      "status": "CONFIRMED"
    },
    "balance": 7000,
    "promocodes": {
      "total": 5,
      "active": 4,
      "inactive": 1
    },
    "report": {
      "usages_count": 10,
      "unique_clients_count": 8,
      "gross_sales_amount": 25000,
      "paid_amount": 20000,
      "client_discount_amount": 5000,
      "agent_credit_amount": 7000,
      "average_paid_amount": 2000
    }
  }
}
```

### Agent Excel Report

```http
GET /promocode/my/report/excel?date_from=2026-06-01&date_to=2026-06-30&status=CONFIRMED
Authorization: Bearer <agent_token>
```

Frontend download example:

```ts
async function downloadAgentReport(params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${baseUrl}/promocode/my/report/excel?${qs}`, {
    headers: { Authorization: `Bearer ${agentToken}` },
  });

  if (!res.ok) throw new Error('Excel download failed');

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'agent_promocode_report.xlsx';
  a.click();
  URL.revokeObjectURL(url);
}
```

Excel columns:

- Дата оплаты
- Промокод
- Тип создания
- Клиент
- Email
- Телефон
- Transaction ID
- Order ID
- Сумма до скидки
- Оплачено клиентом
- Скидка клиенту
- Начислено агенту
- Статус

## Admin Panel

Admin role:

```ts
['SUPER_ADMIN', 'ADMIN']
```

### Global Promo Settings

Get:

```http
GET /promocode/settings
Authorization: Bearer <admin_token>
```

Update:

```http
PATCH /promocode/settings
Authorization: Bearer <admin_token>
Content-Type: application/json
```

Body:

```json
{
  "default_client_discount_amount": 500,
  "default_agent_credit_amount": 700,
  "is_agent_creation_enabled": true,
  "agent_creation_mode": "BOTH",
  "allow_limit_once": true,
  "allow_limit_unlimited": true,
  "allow_limit_custom": true,
  "allow_no_expiry": true,
  "allow_expires_at": true
}
```

Field meaning:

| Field | Type | Meaning |
| --- | --- | --- |
| `default_client_discount_amount` | number/null | Client promo ishlatsa oladigan chegirma |
| `default_agent_credit_amount` | number/null | Agent promo ishlatilganda agentga yoziladigan summa |
| `is_agent_creation_enabled` | boolean/null | Agentlarga promo yaratishga ruxsat |
| `agent_creation_mode` | `AUTO`, `MANUAL`, `BOTH`, null | Agent qaysi usulda promo yaratishi mumkin |
| `allow_limit_once` | boolean/null | Agent `ONCE` limit tanlay oladimi |
| `allow_limit_unlimited` | boolean/null | Agent `UNLIMITED` tanlay oladimi |
| `allow_limit_custom` | boolean/null | Agent `CUSTOM` limit tanlay oladimi |
| `allow_no_expiry` | boolean/null | Agent muddatsiz promo yarata oladimi |
| `allow_expires_at` | boolean/null | Agent expiry date bera oladimi |

Null yuborilsa backend default qiymatdan foydalanadi:

```ts
default_client_discount_amount = 500
default_agent_credit_amount = 700
is_agent_creation_enabled = true
agent_creation_mode = 'BOTH'
allow_* = true
```

### Admin Promo List

```http
GET /promocode/admin?page=1&size=20&status=ACTIVE&agent_id=12&search=LAZIZ
Authorization: Bearer <admin_token>
```

Query:

| Key | Type | Required | Notes |
| --- | --- | --- | --- |
| `page` | number | no | default `1` |
| `size` | number | no | default `20` |
| `status` | `ACTIVE`, `INACTIVE` | no | promo status |
| `agent_id` | number | no | specific agent |
| `search` | string | no | promo code, agent name yoki login |

### Admin Create Promo

```http
POST /promocode/admin
Authorization: Bearer <admin_token>
Content-Type: application/json
```

Manual agent promo:

```json
{
  "code": "TOXIR2026",
  "limit_type": "CUSTOM",
  "usage_limit": 100,
  "expires_at": "2026-12-31T23:59:59.000Z",
  "agent_id": 12,
  "status": "ACTIVE"
}
```

Auto agent promo:

```json
{
  "limit_type": "UNLIMITED",
  "agent_id": 12,
  "status": "ACTIVE"
}
```

Common promo without agent:

```json
{
  "code": "GLOBAL500",
  "limit_type": "ONCE",
  "status": "ACTIVE"
}
```

Admin create rules:

- `code` yuborilsa `creation_mode = MANUAL`.
- `code` yuborilmasa backend auto generate qiladi va `creation_mode = AUTO`.
- `agent_id` bo'lsa, agent active va role `AGENT` bo'lishi kerak.
- `client_discount_amount` va `agent_credit_amount` body'dan kelmaydi. Ular global settingdan olinadi.

### Admin Update Promo

```http
PATCH /promocode/admin/:id
Authorization: Bearer <admin_token>
Content-Type: application/json
```

Body:

```json
{
  "code": "NEWCODE2026",
  "limit_type": "CUSTOM",
  "usage_limit": 50,
  "expires_at": "2026-12-31T23:59:59.000Z",
  "agent_id": 12,
  "status": "ACTIVE"
}
```

All fields optional.

### Admin Change Promo Status

```http
PATCH /promocode/admin/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json
```

Body:

```json
{
  "status": "INACTIVE"
}
```

### Admin Statistics

```http
GET /promocode/admin/statistics
Authorization: Bearer <admin_token>
```

Full query example:

```txt
?date_from=2026-06-01
&date_to=2026-06-30
&status=CONFIRMED
&promo_code=LAZIZ
&agent_id=12
&agent_login=agent
&agent_name=Ali
&client_email=mail.com
&client_phone=99890
&transaction_id=123
&order_id=456
&creation_mode=MANUAL
&promocode_status=ACTIVE
&transaction_status=SUCCESS
```

Query keys:

| Key | Type | Required | Default | Search type |
| --- | --- | --- | --- | --- |
| `date_from` | date | no | no limit | exact lower bound |
| `date_to` | date | no | no limit | exact upper bound |
| `status` | `PENDING`, `CONFIRMED`, `CANCELED` | no | `CONFIRMED` | exact |
| `promo_code` | string | no | all | contains |
| `agent_id` | number | no | all | exact |
| `agent_login` | string | no | all | contains |
| `agent_name` | string | no | all | contains |
| `client_email` | string | no | all | contains |
| `client_phone` | string | no | all | contains |
| `transaction_id` | number | no | all | exact |
| `order_id` | number | no | all | exact |
| `creation_mode` | `AUTO`, `MANUAL`, `BOTH` | no | all | exact |
| `promocode_status` | `ACTIVE`, `INACTIVE` | no | all | exact |
| `transaction_status` | TransactionStatus | no | all | exact |

Response:

```json
{
  "success": true,
  "data": {
    "filters": {
      "date_from": "2026-06-01",
      "date_to": "2026-06-30",
      "promo_code": "LAZIZ",
      "status": "CONFIRMED",
      "agent_id": 12,
      "agent_login": "agent",
      "agent_name": "Ali",
      "client_email": "mail.com",
      "client_phone": "99890",
      "transaction_id": 123,
      "order_id": 456,
      "creation_mode": "MANUAL",
      "promocode_status": "ACTIVE",
      "transaction_status": "SUCCESS"
    },
    "agents": {
      "total": 20,
      "active": 18,
      "with_sales": 5
    },
    "promocodes": {
      "total": 100,
      "active": 90,
      "inactive": 10,
      "with_sales": 12
    },
    "report": {
      "usages_count": 120,
      "unique_clients_count": 95,
      "gross_sales_amount": 300000,
      "paid_amount": 240000,
      "client_discount_amount": 60000,
      "agent_credit_amount": 84000,
      "average_paid_amount": 2000
    },
    "top_agents": [
      {
        "id": 12,
        "name": "Agent name",
        "login": "agent_login",
        "code": null,
        "status": "ACTIVE",
        "creation_mode": null,
        "usages_count": 50,
        "unique_clients_count": 40,
        "gross_sales_amount": 125000,
        "paid_amount": 100000,
        "client_discount_amount": 25000,
        "agent_credit_amount": 35000
      }
    ],
    "top_promocodes": [
      {
        "id": 1,
        "name": "Agent name",
        "login": "agent_login",
        "code": "LAZIZ2525",
        "status": "ACTIVE",
        "creation_mode": "MANUAL",
        "usages_count": 20,
        "unique_clients_count": 18,
        "gross_sales_amount": 50000,
        "paid_amount": 40000,
        "client_discount_amount": 10000,
        "agent_credit_amount": 14000
      }
    ]
  }
}
```

### Admin Excel Report

```http
GET /promocode/admin/report/excel?date_from=2026-06-01&date_to=2026-06-30&status=CONFIRMED
Authorization: Bearer <admin_token>
```

Same filters as `/promocode/admin/statistics`.

Excel sheets:

1. `Сводка`
   - filters
   - total sales
   - unique clients
   - total paid amount
   - total discount
   - total agent credit
   - top agents
   - top promo codes

2. `Продажи`
   - each promo usage/payment row
   - agent
   - promo code
   - client
   - transaction/order
   - paid amount
   - discount
   - agent credit

3. `Агенты`
   - aggregate by agent
   - sales count
   - unique clients
   - paid/discount/credit totals

4. `Промокоды`
   - aggregate by promo code
   - promo type/status
   - agent
   - sales count
   - totals

Download code is the same as agent Excel, only URL changes:

```ts
async function downloadAdminPromoReport(params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${baseUrl}/promocode/admin/report/excel?${qs}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  if (!res.ok) throw new Error('Excel download failed');

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'admin_promocode_report.xlsx';
  a.click();
  URL.revokeObjectURL(url);
}
```

## Recommended Frontend Screens

### Agent Cabinet

Tabs:

1. `Мои промокоды`
   - table from `GET /promocode/my`
   - columns: code, status, creation_mode, usage limit, used_count, expires_at, discount, agent credit

2. `Статистика`
   - cards from `GET /promocode/my/statistics`
   - date range filter
   - promo code filter
   - Excel button

3. `Создать промокод`
   - first call `GET /promocode/my/settings`
   - render radio: auto/manual based on `creation_mode`
   - render limit options based on allow flags
   - render expiry controls based on allow flags

### Admin Promo Page

Tabs:

1. `Настройки`
   - `GET/PATCH /promocode/settings`

2. `Промокоды`
   - `GET /promocode/admin`
   - create/update/status actions

3. `Отчеты`
   - `GET /promocode/admin/statistics`
   - full filter panel
   - Excel export button

Recommended filter UI for admin reports:

- Date range picker: `date_from`, `date_to`
- Select: `status`
- Input: `promo_code`
- Select/search agent: `agent_id`
- Input: `agent_login`
- Input: `agent_name`
- Input: `client_email`
- Input: `client_phone`
- Input number: `transaction_id`
- Input number: `order_id`
- Select: `creation_mode`
- Select: `promocode_status`
- Select: `transaction_status`

## Common Error Handling

Backend errors usually return:

```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400
}
```

Frontend rule:

- `400`: form validation error, show under field or toast.
- `401`: token expired/not valid, logout or refresh token.
- `403`: role/setting restriction, show disabled-state message.
- `404`: promo/agent not found.
- `409`: promo code already exists.
- `500`: server error, generic error toast.

Common messages:

- `Промокод уже существует!`
- `Промокод не найден или неактивен!`
- `Срок действия промокода истек!`
- `Лимит использования промокода исчерпан!`
- `Укажите промокод для ручного создания!`
- `Для автогенерации промокод не передается!`
- `Создание промокодов для агента запрещено!`

