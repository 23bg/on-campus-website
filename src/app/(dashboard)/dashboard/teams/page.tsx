"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { API } from "@/constants/api";
import api from "@/lib/axios";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

type TeamMember = {
    id: string;
    email: string;
    name?: string | null;
    role: "OWNER" | "MANAGER" | "VIEWER";
};

type SessionUser = {
    id: string;
    role: "OWNER" | "MANAGER" | "VIEWER";
};

const teamMemberSchema = z.object({
    email: z.string().trim().max(120, "Email cannot exceed 120 characters.").email("Enter a valid email."),
    name: z.string().trim().min(2, "Name must be at least 2 characters.").max(80, "Name cannot exceed 80 characters."),
    role: z.enum(["MANAGER", "VIEWER"]),
});

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

export default function DashboardTeamsPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
    const form = useForm<TeamMemberFormValues>({
        resolver: zodResolver(teamMemberSchema),
        mode: "onBlur",
        defaultValues: {
            email: "",
            name: "",
            role: "MANAGER",
        },
    });
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        const [sessionResponse, membersResponse] = await Promise.all([
            api.get(API.INTERNAL.AUTH.ME),
            api.get(API.INTERNAL.TEAMS.ROOT),
        ]);

        setSessionUser(sessionResponse.data?.data?.user ?? null);
        setMembers(membersResponse.data?.data ?? []);
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    const canManage = sessionUser?.role === "OWNER";

    const createMember = async (values: TeamMemberFormValues) => {
        await api.post(API.INTERNAL.TEAMS.ROOT, values);
        form.reset({ email: "", name: "", role: "MANAGER" });
        await load();
    };

    const updateRole = async (id: string, role: "MANAGER" | "VIEWER") => {
        await api.patch(API.INTERNAL.TEAMS.BY_ID(id), { role });
        await load();
    };

    const removeMember = async (id: string) => {
        await api.delete(API.INTERNAL.TEAMS.BY_ID(id));
        await load();
    };

    return (
        <main className="p-6">
            <h1 className=" text-2xl font-semibold">Teams</h1>
            <p className="font-sans mt-2 text-muted-foreground">Manage team members and roles for your institute.</p>

            {canManage ? (
                <form onSubmit={form.handleSubmit(createMember)} className="mt-6 rounded border p-4">
                    <FieldGroup className="md:grid-cols-4">
                        <Field>
                            <FieldLabel>Email</FieldLabel>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <input
                                            {...field}
                                            type="email"
                                            placeholder="Email"
                                            maxLength={120}
                                            className="rounded border px-3 py-2 w-full"
                                        />
                                        <FieldError errors={[fieldState.error]} />
                                    </>
                                )}
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Name</FieldLabel>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <input
                                            {...field}
                                            placeholder="Name"
                                            minLength={2}
                                            maxLength={80}
                                            className="rounded border px-3 py-2 w-full"
                                        />
                                        <FieldError errors={[fieldState.error]} />
                                    </>
                                )}
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Role</FieldLabel>
                            <Controller
                                name="role"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <select {...field} className="rounded border px-3 py-2 w-full">
                                            <option value="MANAGER">Manager</option>
                                            <option value="VIEWER">Viewer</option>
                                        </select>
                                        <FieldError errors={[fieldState.error]} />
                                    </>
                                )}
                            />
                        </Field>

                        <Field className="self-end">
                            <button type="submit" className="rounded bg-primary px-4 py-2 text-primary-foreground w-full">
                                Add Member
                            </button>
                        </Field>
                    </FieldGroup>
                </form>
            ) : null}

            {loading ? (
                <p className="mt-6 text-sm text-muted-foreground">Loading team...</p>
            ) : (
                <div className="mt-6 overflow-x-auto rounded border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-3 py-2">Sr. No.</th>
                                <th className="px-3 py-2">Name</th>
                                <th className="px-3 py-2">Email</th>
                                <th className="px-3 py-2">Role</th>
                                {canManage ? <th className="px-3 py-2">Actions</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member, index) => (
                                <tr key={member.id} className="border-t">
                                    <td className="px-3 py-2">{index + 1}</td>
                                    <td className="px-3 py-2">{member.name || "-"}</td>
                                    <td className="px-3 py-2">{member.email}</td>
                                    <td className="px-3 py-2">{member.role}</td>
                                    {canManage ? (
                                        <td className="px-3 py-2">
                                            {member.role === "OWNER" || member.id === sessionUser?.id ? (
                                                <span className="text-muted-foreground">Protected</span>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => updateRole(member.id, member.role === "MANAGER" ? "VIEWER" : "MANAGER")}
                                                        className="rounded border px-2 py-1"
                                                    >
                                                        Make {member.role === "MANAGER" ? "Viewer" : "Manager"}
                                                    </button>
                                                    <button onClick={() => removeMember(member.id)} className="rounded border px-2 py-1 text-red-600">
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    ) : null}
                                </tr>
                            ))}
                            {members.length === 0 ? (
                                <tr>
                                    <td className="px-3 py-4 text-muted-foreground" colSpan={canManage ? 5 : 4}>
                                        No team members found.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}
