'use client';

import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Edit, Trash2, Save, X, Search, Check, RefreshCw } from 'lucide-react';
import { createPost, updatePost, deletePost, getPosts } from '@/app/actions/postActions';

interface Post {
  id: string;
  titleZh: string;
  titleEn: string;
  excerptZh: string;
  excerptEn: string;
  categoryZh: string;
  categoryEn: string;
  contentZh: string;
  contentEn: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function PostsPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [formData, setFormData] = useState({
    titleZh: '',
    titleEn: '',
    excerptZh: '',
    excerptEn: '',
    categoryZh: '',
    categoryEn: '',
    contentZh: '',
    contentEn: '',
    status: '0',
  });
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  useEffect(() => {
    loadPosts(searchParams.get('q') || undefined);
  }, [searchParams]);

  const loadPosts = async (query?: string) => {
    setLoading(true);
    const result = await getPosts(query || searchQuery);
    if (result.success) {
      setPosts(result.posts);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setEditingPost(null);
    setFormData({
      titleZh: '',
      titleEn: '',
      excerptZh: '',
      excerptEn: '',
      categoryZh: '',
      categoryEn: '',
      contentZh: '',
      contentEn: '',
      status: '0',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      titleZh: post.titleZh,
      titleEn: post.titleEn,
      excerptZh: post.excerptZh,
      excerptEn: post.excerptEn,
      categoryZh: post.categoryZh,
      categoryEn: post.categoryEn,
      contentZh: post.contentZh,
      contentEn: post.contentEn,
      status: post.status.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;

    const result = await deletePost(id);
    if (result.success) {
      setToastMessage('删除成功');
      setShowToast(true);
      loadPosts();
    } else {
      setToastMessage('删除失败');
      setShowToast(true);
    }
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData(e.currentTarget);
    data.set('status', formData.status);
    
    if (editingPost) {
      data.set('id', editingPost.id);
    }

    let result;
    if (editingPost) {
      result = await updatePost(data);
    } else {
      result = await createPost(data);
    }

    setSaving(false);
    if (result.success) {
      setToastMessage(editingPost ? '更新成功' : '创建成功');
      setShowToast(true);
      setIsDialogOpen(false);
      loadPosts();
    } else {
      setToastMessage(result.error || '操作失败');
      setShowToast(true);
    }
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {showToast && (
        <div className="fixed top-20 right-8 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 bg-green-100 text-green-700">
          <Check className="h-4 w-4" />
          {toastMessage}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">博客文章管理</h1>
        <p className="text-slate-500 mt-1">管理所有博客文章</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="搜索博客文章..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            className="pl-10"
          />
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          新建文章
        </Button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-2" />
            <p className="text-gray-500">加载中...</p>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">还没有发布任何文章</p>
            <Button onClick={handleCreate}>创建第一篇文章</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{post.titleZh}</CardTitle>
                    <CardDescription className="mt-1">{post.titleEn}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={post.status === 1 ? 'default' : 'secondary'}>
                      {post.status === 1 ? '已发布' : '草稿'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">分类：</span>
                      {post.categoryZh} / {post.categoryEn}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">摘要：</span>
                      {post.excerptZh}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      创建时间：{new Date(post.createdAt).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(post)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      编辑
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      删除
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingPost ? '编辑文章' : '新建文章'}</DialogTitle>
            <DialogDescription>
              填写文章信息，支持中英文双语内容。正文内容使用 Markdown 格式。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titleZh">中文标题 *</Label>
                <Input
                  id="titleZh"
                  name="titleZh"
                  value={formData.titleZh}
                  onChange={(e) => setFormData({ ...formData, titleZh: e.target.value })}
                  placeholder="请输入中文标题"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleEn">英文标题 *</Label>
                <Input
                  id="titleEn"
                  name="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="Please enter English title"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryZh">中文分类</Label>
                <Input
                  id="categoryZh"
                  name="categoryZh"
                  value={formData.categoryZh}
                  onChange={(e) => setFormData({ ...formData, categoryZh: e.target.value })}
                  placeholder="如：前端架构"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryEn">英文分类</Label>
                <Input
                  id="categoryEn"
                  name="categoryEn"
                  value={formData.categoryEn}
                  onChange={(e) => setFormData({ ...formData, categoryEn: e.target.value })}
                  placeholder="e.g., Frontend Architecture"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="excerptZh">中文摘要</Label>
                <Textarea
                  id="excerptZh"
                  name="excerptZh"
                  value={formData.excerptZh}
                  onChange={(e) => setFormData({ ...formData, excerptZh: e.target.value })}
                  placeholder="请输入中文摘要"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerptEn">英文摘要</Label>
                <Textarea
                  id="excerptEn"
                  name="excerptEn"
                  value={formData.excerptEn}
                  onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                  placeholder="Please enter English excerpt"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentZh">中文正文 (Markdown) *</Label>
              <Textarea
                id="contentZh"
                name="contentZh"
                value={formData.contentZh}
                onChange={(e) => setFormData({ ...formData, contentZh: e.target.value })}
                placeholder="请输入中文正文，支持 Markdown 格式"
                rows={15}
                className="font-mono text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentEn">英文正文 (Markdown) *</Label>
              <Textarea
                id="contentEn"
                name="contentEn"
                value={formData.contentEn}
                onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                placeholder="Please enter English content, Markdown format supported"
                rows={15}
                className="font-mono text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>状态</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <RadioGroupItem value="0" label="草稿" />
                <RadioGroupItem value="1" label="已发布" />
              </RadioGroup>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={saving}
              >
                取消
              </Button>
              <Button type="submit" disabled={saving} className="flex items-center gap-2">
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {editingPost ? '更新' : '创建'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}