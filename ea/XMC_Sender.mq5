//+------------------------------------------------------------------+
//| XMC_Sender.mq5 - Free trade sender for XMC platform               |
//+------------------------------------------------------------------+
#property copyright "XMC"
#property version   "1.00"

input string WebhookURL = "https://xmc-roan.vercel.app/api/trade";
input string TraderName = "MyName";
input string RoomCode   = "default";

void OnTradeTransaction(const MqlTradeTransaction& trans,
                        const MqlTradeRequest& request,
                        const MqlTradeResult& result)
{
   if(trans.type != TRADE_TRANSACTION_DEAL_ADD) return;

   if(!HistoryDealSelect(trans.deal))
      return;

   long entry = HistoryDealGetInteger(trans.deal, DEAL_ENTRY);
   if(entry != DEAL_ENTRY_OUT && entry != DEAL_ENTRY_OUT_BY)
      return;

   string symbol   = HistoryDealGetString(trans.deal, DEAL_SYMBOL);
   double profit   = HistoryDealGetDouble(trans.deal, DEAL_PROFIT);
   double volume   = HistoryDealGetDouble(trans.deal, DEAL_VOLUME);
   long   ticket   = trans.deal;
   datetime openT  = (datetime)HistoryDealGetInteger(trans.deal, DEAL_TIME);
   datetime closeT = TimeCurrent();
   int duration    = (int)(closeT - openT);

   string typeStr = (HistoryDealGetInteger(trans.deal, DEAL_TYPE) == DEAL_TYPE_BUY) ? "buy" : "sell";

   string json = StringFormat(
      "{\"trader\":\"%s\",\"room\":\"%s\",\"symbol\":\"%s\",\"type\":\"%s\",\"volume\":%.2f,\"profit\":%.2f,\"open_time\":%d,\"close_time\":%d,\"duration_sec\":%d,\"ticket\":%d}",
      TraderName, RoomCode, symbol, typeStr, volume, profit, (int)openT, (int)closeT, duration, ticket
   );

   char post[];
   char result[];
   string headers = "Content-Type: application/json\r\n";
   StringToCharArray(json, post, 0, WHOLE_ARRAY, CP_UTF8);

   int res = WebRequest("POST", WebhookURL, headers, 5000, post, result, headers);

   if(res == -1)
      Print("XMC WebRequest failed. Error: ", GetLastError(), " — Add URL to MT5 whitelist");
   else
      Print("XMC trade sent. HTTP ", res);
}

void OnInit()
{
   Print("XMC Sender started. Trader: ", TraderName, " Room: ", RoomCode);
}
