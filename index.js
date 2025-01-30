const express = require('express');
const { BbitQRBillGenerator, BbitQRBillFormat, BbitQRBillVersion, BbitQRBillCurrency, BbitQRBillLanguage } = require('@bbitgmbh/bbit.swiss-qr-bill');

const app = express();
const port = 4000;

const UNSTRUCTURED = 'K';
const STRUCTURED = 'S';

app.get('/generate-qr', async (req, res) => {
  const paymentData = {
    format: BbitQRBillFormat.DEFAULT, // Defines the output format
    version: BbitQRBillVersion.V2_0, // Swiss QR Bill standard version
    amount: 100.0,
    currency: BbitQRBillCurrency.EUR, // Currency in CHF
    account: 'CH4431999123000889012', // IBAN account number
    creditor: {
        type: UNSTRUCTURED,
        name: 'bbit gmbh',
        address: 'Rainweg 10',
        postalCode: '3612',
        locality: 'Steffisburg',
        country: 'CH',
    },

    reference: '210000000003139471430009017', // Payment reference
    debtor: {
        type: STRUCTURED,
      name: 'Debtor Name',
      street: 'Debtor Address',
      buildingNumber: '123',
      country: 'CH',
      locality: 'Bern',
      postalCode: '3000',
    },

    unstructuredMessage: 'Invoice 202401', // Additional payment information
    language: BbitQRBillLanguage.EN, // Language of the QR bill
  };

  try {
    const qr = new BbitQRBillGenerator();
    const bufferOrBlob = await qr.generate(paymentData);

    res.setHeader('Content-Disposition', 'inline; filename="swiss-qr-bill.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', bufferOrBlob.length);
    res.end(bufferOrBlob);
  } catch (error) {
    console.error('Error generating QR bill:', error);
    res.status(500).send('Failed to generate QR bill');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
