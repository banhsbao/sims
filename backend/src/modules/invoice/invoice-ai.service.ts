import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import { ProjectService } from '../project/project.service';
import * as fs from 'fs';

@Injectable()
export class InvoiceAiService {
    private genAI: GoogleGenerativeAI;

    constructor(
        private configService: ConfigService,
        private customerService: CustomerService,
        private productService: ProductService,
        private projectService: ProjectService,
    ) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
        }
    }

    async extractInvoiceData(
        filePath: string,
        fileName: string,
        userId: string,
    ) {
        if (!this.genAI) {
            return this.createEmptyDraft(fileName);
        }

        try {
            const imageBuffer = fs.readFileSync(filePath);
            const base64Image = imageBuffer.toString('base64');

            const prompt = `Analyze this invoice image and extract the following information in JSON format:
{
  "customerName": "customer name",
  "customerAddress": "customer address if available",
  "invoiceNumber": "invoice number",
  "items": [
    {
      "productName": "product name",
      "quantity": number,
      "unitPrice": number,
      "totalPrice": number
    }
  ],
  "totalAmount": total amount,
  "paidAmount": paid amount if mentioned,
  "debtAmount": debt/remaining amount if mentioned,
  "projectName": "project name if mentioned"
}

Extract all readable information from the invoice. If a field is not present, omit it or use null.
Return ONLY the JSON object, no explanation.`;

            const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const result = await model.generateContent([
                {
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: base64Image,
                    },
                },
                prompt,
            ]);

            const response = await result.response;
            const responseText = response.text();
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);

            if (!jsonMatch) {
                return this.createEmptyDraft(fileName);
            }

            const extractedData = JSON.parse(jsonMatch[0]);

            let customerId = null;
            if (extractedData.customerName) {
                const customers = await this.customerService.findByName(
                    extractedData.customerName,
                    userId,
                );
                if (customers.length > 0) {
                    customerId = customers[0].id;
                }
            }

            let projectId = null;
            if (extractedData.projectName) {
                const projects = await this.projectService.findByName(
                    extractedData.projectName,
                    userId,
                );
                if (projects.length > 0) {
                    projectId = projects[0].id;
                }
            }

            const items = [];
            if (extractedData.items && Array.isArray(extractedData.items)) {
                for (const item of extractedData.items) {
                    let productId = null;
                    if (item.productName) {
                        const products = await this.productService.findByName(
                            item.productName,
                            userId,
                        );
                        if (products.length > 0) {
                            productId = products[0].id;
                        }
                    }

                    items.push({
                        productName: item.productName || '',
                        quantity: item.quantity || 0,
                        unitPrice: item.unitPrice || 0,
                        totalPrice: item.totalPrice || 0,
                        productId,
                    });
                }
            }

            return {
                draft: {
                    invoiceNumber: extractedData.invoiceNumber || '',
                    customerId,
                    customerName: extractedData.customerName,
                    customerAddress: extractedData.customerAddress,
                    projectId,
                    projectName: extractedData.projectName,
                    totalAmount: extractedData.totalAmount || 0,
                    paidAmount: extractedData.paidAmount || 0,
                    debtAmount: extractedData.debtAmount || 0,
                    imageUrl: `/uploads/${fileName}`,
                    items,
                },
                imageUrl: `/uploads/${fileName}`,
            };
        } catch (error) {
            console.error('Error extracting invoice data:', error);
            return this.createEmptyDraft(fileName);
        }
    }

    private createEmptyDraft(fileName: string) {
        return {
            draft: {
                invoiceNumber: '',
                customerId: null,
                customerName: '',
                totalAmount: 0,
                paidAmount: 0,
                debtAmount: 0,
                imageUrl: `/uploads/${fileName}`,
                items: [],
            },
            imageUrl: `/uploads/${fileName}`,
        };
    }
}
