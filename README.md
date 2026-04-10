# Portfolio Tracker

A personal stock portfolio tracker with cloud sync — access your holdings from any device.

## Features

- **Multi-exchange support** — NSE, BSE, and US stocks
- **Yahoo Finance prices** — Refresh to get latest quotes
- **Cloud storage** — Holdings saved to MongoDB, synced across devices
- **Authentication** — Sign up with email or Google/GitHub
- **Account labels** — Tag holdings by broker (Zerodha, Groww, etc.)
- **Dashboard** — Total invested, current value, P&L, overall return, day change

## How to Use

1. Visit the site and sign up / log in
2. Add a stock — enter symbol (e.g. RELIANCE), select exchange (NSE/BSE), enter quantity and buy price
3. For US stocks, enter the symbol (e.g. AAPL) and leave exchange blank
4. Click **Refresh prices** to fetch the latest quotes
5. Log in from any device to see the same portfolio

## Notes

- Yahoo Finance prices are delayed 15–20 minutes, not real-time
- Prices update each time you click Refresh or reload the page
- Deleting a holding removes it permanently from the database
