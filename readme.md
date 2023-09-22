
# Deployment

[Tarbimise graafik](https://nata1993.github.io/tarbimise_graafik/)

# A web application for comparing and reading your electricity consumption data

~~Eesti Gaas nor Elektrilevi does not give you a reading on how much you used electricity in monetary values.
Pretty sure other electricity providers also do not share such data. They only give you how much you have
consumed (kwh). In order to know how much you used electricity in a monetary value, this web application has
been created.~~  
Elering AS has finnaly option to read your consumption also in monetary values! However, they lack on tools
and statistics to compile much more detailed data for you. Hence this tool has been created.

Application takes CSV file filled with data either from Eesti Gaas or from Elektrilevi. You have to export
the CSV file from either of these service providers by yourself since they dont give an API for such procedure.
After feeding data from CSV file to this application, you will be presented with a graph of how much and when
you consumed electricity as well as how much it has costed to you at particular hour. Included are some basic
statistics also: highest cost; highest price; highest consumption; e.t.c.

NB! This web application is only for stock market priced electricity. Fixed price services or 50/50 services
are not usable by this web application, for now that is.
Application will take Nord Pool Spot prices data from Elering AS by their means of API. To such price will be
added VAT of 20% and excise (excise not yet implemented) in order to calculate exact cost of electricity usage at any hour consumed in previous
hours.
NB! CSV file data wont contain 100% consumed electricity data because latest consumtion data (around 5-12 hours)
is usually not present since Elektrilevi has not read the metering device for data. Data is updated many times
a day but latest data is needed to be waited for, hence no latest data in the CSV file.

The tool has an option to download the raw data for archival purposes within limits of the API for electricity
prices.

## Dependencies

[Papa Parse](https://www.papaparse.com/) - for CSV file data parsing.

## Privacy

Application does not store, analyze nor send your data anywhere. Its all localhost.
Application uses Session Storage for the purpose if user wants to download data for archival
purpose. Closing the tab will clear all cookies.
Application uses Local Storage for the purpose of storing Network Fees input values for future
usage of application. Network Fees input cookie will expire in 90 days.

## Limitations

Application uses JavaScript! Without enabling JavaScript in your browser, only HTML and CSS will be loaded.
