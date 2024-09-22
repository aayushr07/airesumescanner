import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import formidable from 'formidable';
import { exec } from 'child_process';

export const config = {
    api: {
        bodyParser: false,
    },
};

const saveFile = async (file) => {
    const data = await fs.readFile(file.filepath);
    const uploadPath = path.join(process.cwd(), 'uploads', file.originalFilename);
    await fs.writeFile(uploadPath, data);
    return uploadPath;
};

export async function POST(req) {
    const form = new formidable.IncomingForm();

    return new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return resolve(NextResponse.json({ message: 'Error processing form' }, { status: 500 }));
            }

            const file = files.resume;
            const filePath = await saveFile(file);

            exec(`python3 path/to/your/trial.py ${filePath}`, (error, stdout, stderr) => {
                if (error) {
                    return resolve(NextResponse.json({ message: `Error running Python script: ${error.message}` }, { status: 500 }));
                }
                if (stderr) {
                    return resolve(NextResponse.json({ message: `Script error: ${stderr}` }, { status: 500 }));
                }

                const output = stdout.split('\n');
                resolve(NextResponse.json({ output }));
            });
        });
    });
}
