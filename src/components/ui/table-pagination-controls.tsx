"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TablePaginationControlsProps = {
    page: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    className?: string;
};

export function TablePaginationControls({
    page,
    pageSize,
    totalItems,
    onPageChange,
    className,
}: TablePaginationControlsProps) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
    const end = Math.min(safePage * pageSize, totalItems);

    return (
        <div className={cn("flex items-center justify-between gap-3 px-2 pb-2", className)}>
            <p className="text-xs text-muted-foreground">
                {totalItems === 0
                    ? "No records"
                    : `Showing ${start}-${end} of ${totalItems}`}
            </p>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(safePage - 1)}
                    disabled={safePage <= 1}
                >
                    Previous
                </Button>
                <span className="text-xs text-muted-foreground">
                    Page {safePage} of {totalPages}
                </span>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(safePage + 1)}
                    disabled={safePage >= totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
