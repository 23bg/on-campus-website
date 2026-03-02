"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePaginationControls } from "@/components/ui/table-pagination-controls";

export type TeamRow = {
    id: string;
    name: string;
    phone: string;
    email: string;
    role: "OWNER" | "MANAGER" | "COUNSELOR" | "TEACHER" | "VIEWER";
    active: boolean;
    subjects?: string;
    experience?: string;
    bio?: string;
    source: "team" | "teacher";
};

type TeamTableProps = {
    rows: TeamRow[];
    canManage: boolean;
    onEdit: (member: TeamRow) => void;
    onDelete: (member: TeamRow) => void;
};

const PAGE_SIZE = 10;

export default function TeamTable({ rows, canManage, onEdit, onDelete }: TeamTableProps) {
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [rows.length]);

    const paginatedRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const displayRole = (role: TeamRow["role"]) => {
        if (role === "MANAGER") return "EDITOR";
        if (role === "COUNSELOR") return "EDITOR";
        return role;
    };

    return (
        <div className="mt-4 rounded border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Sr. No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Subjects</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead className="w-[140px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No team members found.</TableCell>
                        </TableRow>
                    ) : (
                        paginatedRows.map((member, index) => (
                            <TableRow key={`${member.source}-${member.id}`}>
                                <TableCell>{(page - 1) * PAGE_SIZE + index + 1}</TableCell>
                                <TableCell className="font-medium">{member.name}</TableCell>
                                <TableCell>{member.phone || "-"}</TableCell>
                                <TableCell>{member.email || "-"}</TableCell>
                                <TableCell>{displayRole(member.role)}</TableCell>
                                <TableCell>{member.active ? "Yes" : "No"}</TableCell>
                                <TableCell>{member.subjects || "-"}</TableCell>
                                <TableCell>{member.experience || "-"}</TableCell>
                                <TableCell>
                                    {canManage ? (
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => onEdit(member)}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => onDelete(member)}>Delete</Button>
                                        </div>
                                    ) : (
                                        "-"
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <TablePaginationControls
                className="mt-3"
                page={page}
                pageSize={PAGE_SIZE}
                totalItems={rows.length}
                onPageChange={setPage}
            />
        </div>
    );
}
