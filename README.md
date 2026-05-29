# Wedding Invite App

A Next.js wedding invitation app with a live admin builder. Edit text and photos via `/admin`, and share `/invite` with guests.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root `/` redirects to `/invite`.

In local development, wedding config is read from and saved to `config.json` in the project root. Uploaded photos are stored on the filesystem at `public/images/`.

## Configuration

All wedding details live in `config.json`:

| Field | Description | Example |
|---|---|---|
| `groomName` | Groom's name | `Nguyễn Văn A` |
| `brideName` | Bride's name | `Trần Thị B` |
| `groomEventDate` | Groom-side event date | `15/10/2025 - Nhà Trai` |
| `brideEventDate` | Bride-side event date | `14/10/2025 - Nhà Gái` |
| `eventDay` | Day number | `15` |
| `eventWeekday` | Day of week | `Thứ Tư` |
| `eventMonthYear` | Month and year | `10 - 2025` |
| `eventTime` | Reception time | `11 GIỜ 00` |
| `lunarDate` | Lunar calendar date | `14 tháng 9 năm Ất Tỵ` |
| `venue` | Venue name | `NHÀ HÀNG TIỆC CƯỚI ABC` |
| `venueAddress` | Venue address | `123 Đường ABC, Quận 1, TP.HCM` |
| `photos` | Map of slot → image URL | see `config.json` |

You can edit `config.json` directly, or use the admin UI at `/admin`.

## Admin UI (`/admin`)

- Edit all text fields in the left panel and click **Lưu** to save.
- Click any photo thumbnail to replace it with a local file upload.
- The right panel shows a live preview of the invite at `/invite`.

## Deploying to Vercel

### 1. Push to GitHub

Make sure your code is in a GitHub (or GitLab/Bitbucket) repository.

### 2. Create a Vercel Blob store

Config and photos are stored in Vercel Blob in production (the app falls back to the local filesystem only when `BLOB_READ_WRITE_TOKEN` is not set).

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Navigate to **Storage** → **Create Database** → **Blob**.
3. Name it anything (e.g. `wedding-blob`) and click **Create**.
4. Open the store, click the **.env.local** tab, and copy the `BLOB_READ_WRITE_TOKEN` value.

### 3. Import the project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
2. Vercel auto-detects Next.js. The settings in `vercel.json` already set the region to `sin1` (Singapore) — change this if needed.
3. Before deploying, add the environment variable:

   | Name | Value |
   |---|---|
   | `BLOB_READ_WRITE_TOKEN` | paste the token from step 2 |

   Optionally add `ADMIN_PASSWORD` to protect the `/admin` route.

4. Click **Deploy**.

### 4. Seed initial config (first deploy only)

On the first deploy, Vercel Blob has no config yet. The app will fall back to the default `config.json` baked into the build, so the invite will show placeholder text.

To populate Blob with your real config, open `https://<your-domain>/admin`, fill in the details, and click **Lưu**. This writes `config/wedding.json` to Blob and all subsequent requests will read from there.

### 5. Environment variables reference

| Variable | Required | Description |
|---|---|---|
| `BLOB_READ_WRITE_TOKEN` | Yes (production) | Vercel Blob token for config and photo storage |
| `ADMIN_PASSWORD` | No | If set, the `/admin` route requires this password |

### Re-deploying

Push to your main branch — Vercel will build and deploy automatically. Config and photos stored in Blob persist across deploys because they live outside the build artifact.
