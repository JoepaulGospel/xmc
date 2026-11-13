//+------------------------------------------------------------------+
//|                                                     XMC_Sender.mq5 |
//|                                      XMC - Auto Trade Reporter     |
//|                                                                  |
//+------------------------------------------------------------------+
#property copyright "XMC"
#property version   "1.00"
#property strict

input string WebhookURL = "http://127.0.0.1:5000/api/trade";  // XMC server URL
input string ApiToken   = "your-secret-token";               // Optional auth token
input string TraderName = "YourName";                        // Your display name on leaderboard
input string RoomCode   = "default";                         // Room to post into

//+------------------------------------------------------------------+
int OnInit()
  {
   Print("XMC Sender initialized. Webhook: ", WebhookURL);
   return(INIT_SUCCEEDED);
  }

//+------------------------------------------------------------------+
void OnTradeTransaction(const MqlTradeTransaction &trans,
                        const MqlTradeRequest &request,
                        const MqlTradeResult &result)
  {
   // Only care about new deals that close positions
   if(trans.type != TRADE_TRANSACTION_DEAL_ADD)
      return;

   ulong deal = trans.deal;
   if(deal == 0 || !HistoryDealSelect(deal))
      return;

   long entry = HistoryDealGetInteger(deal, DEAL_ENTRY);
   if(entry != DEAL_ENTRY_OUT && entry != DEAL_ENTRY_OUT_BY && entry != DEAL_ENTRY_INOUT)
      return;  // not a closing deal

   // Gather data
   string symbol   = HistoryDealGetString(deal, DEAL_SYMBOL);
   double volume   = HistoryDealGetDouble(deal, DEAL_VOLUME);
   double profit   = HistoryDealGetDouble(deal, DEAL_PROFIT);
   double swap     = HistoryDealGetDouble(deal, DEAL_SWAP);
   double comm     = HistoryDealGetDouble(deal, DEAL_COMMISSION);
   double net      = profit + swap + comm;
   datetime closeT = (datetime)HistoryDealGetInteger(deal, DEAL_TIME);
   ulong posTicket = HistoryDealGetInteger(deal, DEAL_POSITION_ID);

   // Try to get open time from position history
   datetime openT = closeT;
   if(HistorySelectByPosition(posTicket))
     {
      int deals = HistoryDealsTotal();
      for(int i = 0; i < deals; i++)
        {
         ulong d = HistoryDealGetTicket(i);
         if(HistoryDealGetInteger(d, DEAL_ENTRY) == DEAL_ENTRY_IN)
           {
            openT = (datetime)HistoryDealGetInteger(d, DEAL_TIME);
            break;
           }
        }
     }

   long duration_sec = (long)(closeT - openT);
   if(duration_sec < 0) duration_sec = 0;

   string typeStr = (HistoryDealGetInteger(deal, DEAL_TYPE) == DEAL_TYPE_BUY) ? "buy" : "sell";

   // Build JSON
   string json = "{";
   json += "\"token\":\"" + ApiToken + "\",";
   json += "\"trader\":\"" + TraderName + "\",";
   json += "\"room\":\"" + RoomCode + "\",";
   json += "\"symbol\":\"" + symbol + "\",";
   json += "\"type\":\"" + typeStr + "\",";
   json += "\"volume\":" + DoubleToString(volume, 2) + ",";
   json += "\"profit\":" + DoubleToString(net, 2) + ",";
   json += "\"open_time\":" + IntegerToString((long)openT) + ",";
   json += "\"close_time\":" + IntegerToString((long)closeT) + ",";
   json += "\"duration_sec\":" + IntegerToString(duration_sec) + ",";
   json += "\"ticket\":" + IntegerToString((long)deal);
   json += "}";

   SendWebhook(json);
  }

//+------------------------------------------------------------------+
void SendWebhook(string payload)
  {
   char data[];
   char result[];
   string result_headers;
   string headers = "Content-Type: application/json\r\n";

   StringToCharArray(payload, data, 0, StringLen(payload));

   ResetLastError();
   int res = WebRequest("POST", WebhookURL, headers, 5000, data, result, result_headers);

   if(res == -1)
     {
      int err = GetLastError();
      Print("XMC WebRequest failed. Error: ", err, " | Make sure URL is allowed in Tools > Options > Expert Advisors");
     }
   else
     {
      Print("XMC trade sent successfully. Response code: ", res);
     }
  }
//+------------------------------------------------------------------+
