import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Label } from "./components/ui/label"
import { Input } from "./components/ui/input"


export default function Playground() {
    return (
        <>
            <Dialog open={true}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <DialogHeader className="mb-4">
                                <DialogTitle>Welcome Back</DialogTitle>
                                <DialogDescription>Sign in to your AlumniConnect account</DialogDescription>
                            </DialogHeader>
                        </DialogTitle>
                        <Label>Enial</Label>
                        <Input></Input>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
} 