import { Button } from "@/components/ui/button"
import {useEffect, useState} from 'react';

export default function Table({handleSubmit
    , headers}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await handleSubmit();
                console.log(result)
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [handleSubmit]);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th key={header} className="px-4 py-2 bg-gray-800 text-white">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((user) => (
                        <tr key={user._id}>
                            <td className="px-4 py-2 border-b">#US01</td>
                            <td className="px-4 py-2 border-b">{user.userName}</td>
                            <td className="px-4 py-2 border-b">{user.role.roleName}</td>
                            <td className="px-4 py-2 border-b">{user.email}</td>
                            <td className="px-4 py-2 border-b">{new Date(user.lastLogin_date).toLocaleString()}</td>
                            <td className="px-4 py-2 border-b">{new Date(user.lastLogin_date).toLocaleString()}</td>
                            <td className="px-4 py-2 border-b">{user.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* <Button>Click me</Button> */}
        </div>
    );
}