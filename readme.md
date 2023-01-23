# work still in progress
## An web application for comparing a and reading your electricity consumption data.

Eesti Gaas nor Elektrilevi does not give you a reading on how much you used electricity in monetary values.
They give it only how much you have consumed (kwh). For getting to know how much you used electricity in a
monetary value, this web application has been created.

Application uses JavaScript.
Application does not store, analyze nor send your data anywhere. Its all localhost.
Application takes CSV file filled with data either from Eesti Gaas or from Elektrilevi. You have to export
the CSV file from either of these service providers by yourself since they dont give an API for such procedure.
After feeding data from CSV file to this application, you will be presented with a graph of how much and when
you consumed electricity as well as how much it has costed to you at particular hour.
NB! This web application is only for stock market priced electricity. Fixed price services or 50/50 services
are not usable by this web application, for now that is. 
Application will take Nord Pool Spot prices data from Elering AS by their means of API. To such price will be
added VAT of 20% and excise, possibly Green Energy tax, in order to calculate exact cost of electricity usage
at any hour consumed in previous hours.
NB! CSV file data wont contain 100% consumed electricity data because latest consumtion data (around 5-12 hours)
is usually not present since Elektrilevi has not read the metering device for data. Data is updated many times 
a day but latest data is needed to be waited for, hence no the latest data in CSV file data.