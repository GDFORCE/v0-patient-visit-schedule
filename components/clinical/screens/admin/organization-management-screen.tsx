"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Building2,
  Users,
  FileText,
  MoreVertical,
  Eye,
  Edit,
  Ban,
  Merge,
  MapPin,
  Phone,
  Mail,
  Globe,
  AlertTriangle,
  ArrowRight,
  Check,
  X,
} from "lucide-react";

interface OrganizationManagementScreenProps {
  onBack?: () => void;
}

const organizations = [
  {
    id: "ORG-001",
    name: "PharmaCorp Inc",
    type: "Sponsor",
    address: "123 Pharma Street, Boston, MA 02101",
    contact: "+1 555-0100",
    email: "contact@pharmacorp.com",
    website: "www.pharmacorp.com",
    users: 45,
    trials: 12,
    status: "Active",
  },
  {
    id: "ORG-002",
    name: "Global CRO Partners",
    type: "CRO",
    address: "456 Research Ave, San Francisco, CA 94102",
    contact: "+1 555-0200",
    email: "info@globalcro.com",
    website: "www.globalcro.com",
    users: 128,
    trials: 28,
    status: "Active",
  },
  {
    id: "ORG-003",
    name: "HealthSite Management",
    type: "SMO",
    address: "789 Health Blvd, Chicago, IL 60601",
    contact: "+1 555-0300",
    email: "admin@healthsite.com",
    website: "www.healthsite.com",
    users: 67,
    trials: 15,
    status: "Active",
  },
  {
    id: "ORG-004",
    name: "City General Hospital",
    type: "Site",
    address: "321 Hospital Drive, New York, NY 10001",
    contact: "+1 555-0400",
    email: "research@citygeneral.org",
    website: "www.citygeneral.org",
    users: 23,
    trials: 8,
    status: "Active",
  },
  {
    id: "ORG-005",
    name: "Research Medical Center",
    type: "Site",
    address: "654 Medical Plaza, Los Angeles, CA 90001",
    contact: "+1 555-0500",
    email: "trials@researchmed.com",
    website: "www.researchmed.com",
    users: 18,
    trials: 6,
    status: "Suspended",
  },
];

interface NameRequest {
  id: string;
  requestedBy: string;
  current: string;
  requested: string;
  type: string;
  usersAffected: number;
  trials: number;
}

const initialNameRequests: NameRequest[] = [
  { id: "NC-01", requestedBy: "D. Chen · Site Coordinator", current: "Apollo Hosp.", requested: "Apollo Hospital", type: "Site", usersAffected: 23, trials: 8 },
  { id: "NC-02", requestedBy: "P. Nair · CRO Manager", current: "Global CRO", requested: "Global CRO Partners", type: "CRO", usersAffected: 128, trials: 28 },
];

export function OrganizationManagementScreen({ onBack }: OrganizationManagementScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedOrg, setSelectedOrg] = useState<typeof organizations[0] | null>(null);

  // Merge confirmation dialog
  const [mergeOrg, setMergeOrg] = useState<typeof organizations[0] | null>(null);
  const [mergeJustification, setMergeJustification] = useState("");

  // Name correction requests
  const [nameRequests, setNameRequests] = useState<NameRequest[]>(initialNameRequests);
  const [editedNames, setEditedNames] = useState<Record<string, string>>({});

  const openMerge = (org: typeof organizations[0]) => {
    setMergeOrg(org);
    setMergeJustification("");
  };
  const confirmMerge = () => {
    if (!mergeOrg || !mergeJustification.trim()) return;
    toast.success(`${mergeOrg.name} merged into master record`);
    setMergeOrg(null);
    setSelectedOrg(null);
  };

  const approveName = (r: NameRequest) => {
    const finalName = editedNames[r.id] ?? r.requested;
    setNameRequests((prev) => prev.filter((x) => x.id !== r.id));
    toast.success(`Name correction applied: ${finalName}`);
  };
  const rejectName = (r: NameRequest) => {
    setNameRequests((prev) => prev.filter((x) => x.id !== r.id));
    toast.success(`Request from ${r.requestedBy} rejected`);
  };

  const tiles = [
    { label: "Total orgs", value: organizations.length },
    { label: "Sponsor", value: organizations.filter((o) => o.type === "Sponsor").length },
    { label: "CRO", value: organizations.filter((o) => o.type === "CRO").length },
    { label: "SMO", value: organizations.filter((o) => o.type === "SMO").length },
    { label: "Sites", value: organizations.filter((o) => o.type === "Site").length },
    { label: "Duplicates", value: 1 },
    { label: "Name reqs", value: nameRequests.length },
    { label: "Linked users", value: organizations.reduce((n, o) => n + o.users, 0) },
  ];

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || org.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Sponsor":
        return "bg-purple-100 text-purple-700";
      case "CRO":
        return "bg-blue-100 text-blue-700";
      case "SMO":
        return "bg-teal-100 text-teal-700";
      case "Site":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-[#1A3872]">Organization master list</h1>
          <p className="text-sm text-gray-500">Manage organizations, duplicates, and name correction requests.</p>
        </div>
        <Button className="bg-[#1A3872] hover:bg-[#15305f]" onClick={() => toast.success("Add organization form")}>
          <Building2 className="h-4 w-4 mr-2" /> Add organization
        </Button>
      </div>

      {/* Summary tiles (ADM-03 Section 1) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl bg-white border border-gray-200 p-3 text-center">
            <div className="text-xl font-bold text-[#1A3872] leading-none">{t.value}</div>
            <div className="text-[11px] text-gray-500 mt-1.5">{t.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: search + org table */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search organizations by name or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px] h-10 text-sm">
                <SelectValue placeholder="Entity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="Sponsor">Sponsor</SelectItem>
                <SelectItem value="CRO">CRO</SelectItem>
                <SelectItem value="SMO">SMO</SelectItem>
                <SelectItem value="Site">Site</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3 font-medium">Organization</th>
                    <th className="px-4 py-3 font-medium">Address</th>
                    <th className="px-4 py-3 font-medium">Users</th>
                    <th className="px-4 py-3 font-medium">Trials</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrgs.map((org) => (
                    <tr key={org.id} className="hover:bg-gray-50/70">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-[#DBEAFE] flex items-center justify-center shrink-0">
                            <Building2 className="h-5 w-5 text-[#1A3872]" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 truncate">{org.name}</div>
                            <Badge className={`text-[10px] mt-0.5 ${getTypeColor(org.type)}`}>{org.type}</Badge>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 max-w-[220px]">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 shrink-0" /> {org.address}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{org.users}</td>
                      <td className="px-4 py-3 text-gray-600">{org.trials}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`text-xs ${org.status === "Active" ? "border-green-500 text-green-700" : "border-red-500 text-red-700"}`}
                        >
                          {org.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedOrg(org)} title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedOrg(org)}>
                                <Eye className="h-4 w-4 mr-2" /> View details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success(`Editing ${org.name}`)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit info
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openMerge(org)}>
                                <Merge className="h-4 w-4 mr-2" /> Merge duplicate
                              </DropdownMenuItem>
                              {org.status === "Active" ? (
                                <DropdownMenuItem className="text-red-600" onClick={() => toast.success(`${org.name} suspended`)}>
                                  <Ban className="h-4 w-4 mr-2" /> Suspend
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-600" onClick={() => toast.success(`${org.name} activated`)}>
                                  <Building2 className="h-4 w-4 mr-2" /> Activate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Name correction requests (ADM-03 Section 4) */}
        <div className="xl:col-span-1">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <h2 className="text-sm font-semibold text-[#1A3872] mb-3">Name correction requests</h2>
              {nameRequests.length === 0 && (
                <p className="text-xs text-gray-400 py-6 text-center">No pending requests.</p>
              )}
              <div className="space-y-3">
                {nameRequests.map((r) => (
                  <div key={r.id} className="rounded-lg border border-amber-200 bg-amber-50/40 p-3">
                    <p className="text-[11px] text-gray-500">{r.requestedBy}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <span className="text-red-600 line-through">{r.current}</span>
                      <ArrowRight className="h-3 w-3 text-gray-400" />
                      <span className="text-green-700 font-medium">{r.requested}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      {r.type} · {r.usersAffected} users · {r.trials} trials affected
                    </p>
                    <Input
                      value={editedNames[r.id] ?? r.requested}
                      onChange={(e) => setEditedNames((p) => ({ ...p, [r.id]: e.target.value }))}
                      className="h-8 mt-2 text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700" onClick={() => approveName(r)}>
                        <Check className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-xs text-red-700 border-red-200" onClick={() => rejectName(r)}>
                        <X className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Merge confirmation dialog (ADM-03) */}
      {mergeOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 space-y-3">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-semibold text-gray-800">Confirm merge</p>
            </div>
            <p className="text-sm text-gray-600">
              {mergeOrg.users} users and {mergeOrg.trials} trials will be re-linked to the master record.
              {" "}{mergeOrg.name} will be archived. This action is irreversible.
            </p>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Admin justification (required, logged)</p>
              <Textarea value={mergeJustification} onChange={(e) => setMergeJustification(e.target.value)} className="min-h-[60px]" />
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setMergeOrg(null)}>
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1" disabled={!mergeJustification.trim()} onClick={confirmMerge}>
                Confirm merge
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Organization Detail Sheet */}
      <Sheet open={!!selectedOrg} onOpenChange={() => setSelectedOrg(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Organization Details</SheetTitle>
          </SheetHeader>
          {selectedOrg && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-[#DBEAFE] flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-[#1A3872]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{selectedOrg.name}</h2>
                  <Badge className={`mt-1 ${getTypeColor(selectedOrg.type)}`}>
                    {selectedOrg.type}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <Users className="h-5 w-5 text-[#2563EB] mx-auto mb-1" />
                  <div className="text-lg font-semibold">{selectedOrg.users}</div>
                  <div className="text-xs text-gray-500">Users</div>
                </div>
                <div className="p-3 bg-teal-50 rounded-lg text-center">
                  <FileText className="h-5 w-5 text-[#0D9488] mx-auto mb-1" />
                  <div className="text-lg font-semibold">{selectedOrg.trials}</div>
                  <div className="text-xs text-gray-500">Trials</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm">{selectedOrg.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="text-sm">{selectedOrg.contact}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm">{selectedOrg.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Website</p>
                    <p className="text-sm">{selectedOrg.website}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => toast.success(`Editing ${selectedOrg.name}`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Info
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openMerge(selectedOrg)}
                >
                  <Merge className="h-4 w-4 mr-2" />
                  Merge Duplicate
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
